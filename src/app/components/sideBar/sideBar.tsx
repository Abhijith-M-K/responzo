'use client';
import React from 'react';
import styles from './sideBar.module.scss';
import { Plus } from 'lucide-react';

type SidebarProps = {
  collections: string[];
  onAddRequest: () => void;
  onSelectCollection: (collection: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collections, onAddRequest, onSelectCollection }) => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Collections</h2>

      <ul className={styles.collectionList}>
        {collections.map((collection, index) => (
          <li
            key={index}
            className={styles.collectionItem}
            onClick={() => onSelectCollection(collection)}
          >
            {collection}
          </li>
        ))}
      </ul>

      <button className={styles.addButton} onClick={onAddRequest}>
        <Plus size={16} />
        Add New Request
      </button>
    </aside>
  );
};

export default Sidebar;
