'use client';
import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import styles from "./requestForm.module.scss";

type KeyValue = { key: string; value: string };

export default function RequestForm() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [params, setParams] = useState<KeyValue[]>([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState<KeyValue[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState(`{}`);
  const [authType, setAuthType] = useState("None");
  const [bearerToken, setBearerToken] = useState("");
  const [useProxy, setUseProxy] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("params");

  const handleKeyValueChange = (
    type: "params" | "headers",
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const list = type === "params" ? [...params] : [...headers];
    list[index][field] = value;
    type === "params" ? setParams(list) : setHeaders(list);
  };

  const addKeyValue = (type: "params" | "headers") => {
    const list = type === "params" ? [...params] : [...headers];
    list.push({ key: "", value: "" });
    type === "params" ? setParams(list) : setHeaders(list);
  };

  const buildQueryString = () =>
    params
      .filter(p => p.key)
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

  const getHeadersObject = () => {
    const headerObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key) headerObj[h.key] = h.value;
    });
    if (authType === "Bearer" && bearerToken) {
      headerObj["Authorization"] = `Bearer ${bearerToken}`;
    }
    return headerObj;
  };

  const sendRequest = async () => {
    try {
      const finalUrl = url.includes("?") ? `${url}&${buildQueryString()}` : `${url}?${buildQueryString()}`;
      const finalHeaders = getHeadersObject();
      const data = method !== "GET" ? JSON.parse(body || "{}") : undefined;

      const config = {
        method,
        url: useProxy ? `/api/proxy?targetUrl=${encodeURIComponent(finalUrl)}` : finalUrl,
        headers: finalHeaders,
        data: useProxy ? { headers: finalHeaders, body: data, method } : data,
      };

      const start = performance.now();
      const res = await axios(config);
      const end = performance.now();

      setResponse({
        data: res.data,
        status: res.status,
        statusText: res.statusText,
        time: `${(end - start).toFixed(2)} ms`,
        size: JSON.stringify(res.data).length + " B",
      });
      setError(null);
    } catch (err: any) {
      setError(err.response || { message: err.message });
      setResponse(null);
    }
  };

  const exportAsJson = () => {
    if (response?.data) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "response.json";
      link.click();
    }
  };

  const exportAsExcel = () => {
    if (response?.data) {
      const ws = XLSX.utils.json_to_sheet([response.data].flat());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Response");
      XLSX.writeFile(wb, "response.xlsx");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={styles.dropdown}>
          {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter API URL" className={styles.input} />

        <button onClick={sendRequest} className={styles.button}>Send</button>
      </div>

      <div className={styles.tabs}>
        {["params", "headers", "body"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`${styles.button} ${activeTab === tab ? styles.activeTab : ""}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "params" && renderKeyValueInput("params", params, handleKeyValueChange, addKeyValue)}
      {activeTab === "headers" && renderKeyValueInput("headers", headers, handleKeyValueChange, addKeyValue)}
      {activeTab === "body" && method !== "GET" && (
        <textarea
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Raw JSON Body"
          className={styles.textarea}
        />
      )}

      <div className={styles.authRow}>
        <label>Auth Type:</label>
        <select value={authType} onChange={(e) => setAuthType(e.target.value)} className={styles.dropdown}>
          <option value="None">None</option>
          <option value="Bearer">Bearer Token</option>
        </select>
      </div>

      {authType === "Bearer" && (
        <input
          type="text"
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
          placeholder="Enter Bearer Token"
          className={styles.input}
        />
      )}

      <div className={styles.checkboxRow}>
        <label>
          <input type="checkbox" checked={useProxy} onChange={() => setUseProxy(!useProxy)} />
          Use CORS Proxy
        </label>
      </div>

      <div className={styles.responseBlock}>
        <h3 className={styles.responseTitle}>Response</h3>
        {response && (
          <>
            <div className={styles.responseMeta}>
              <strong>Status:</strong> {response.status} {response.statusText} |
              <strong> Time:</strong> {response.time} |
              <strong> Size:</strong> {response.size}
            </div>

            <textarea
              readOnly
              className={styles.responseArea}
              value={JSON.stringify(response.data, null, 2)}
            />

            <div className={styles.exportButtons}>
              <button onClick={exportAsJson} className={styles.button}>Export JSON</button>
              {/* <button onClick={exportAsExcel} className={styles.button}>Export Excel</button> */}
            </div>
          </>
        )}
        {error && (
          <textarea
            readOnly
            className={styles.responseArea}
            value={JSON.stringify(error.data || { message: error.message }, null, 2)}
          />
        )}
      </div>
    </div>
  );
}

function renderKeyValueInput(
  type: "params" | "headers",
  data: KeyValue[],
  onChange: (type: any, index: number, field: any, value: any) => void,
  onAdd: (type: any) => void
) {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className={styles.kvRow}>
          <input
            value={item.key}
            onChange={(e) => onChange(type, index, "key", e.target.value)}
            placeholder="Key"
            className={styles.input}
          />
          <input
            value={item.value}
            onChange={(e) => onChange(type, index, "value", e.target.value)}
            placeholder="Value"
            className={styles.input}
          />
        </div>
      ))}
      <button onClick={() => onAdd(type)} className={styles.button}>+ Add</button>
    </div>
  );
}
