import { useMemo, useState } from 'react';
import { Check, Pencil, Plus, Trash2, Undo2 } from 'lucide-react';

const initialItems = [
  { id: 1, name: 'חלב', quantity: 1, category: 'מוצרי חלב', requestedBy: 'Guy', purchased: false },
  { id: 2, name: 'לחם', quantity: 2, category: 'מאפייה', requestedBy: 'Shelly', purchased: false },
  { id: 3, name: 'עגבניות', quantity: 6, category: 'ירקות ופירות', requestedBy: 'Or', purchased: true },
];

const familyMembers = ['Guy', 'Shelly', 'Or'];
const categories = ['כללי', 'מוצרי חלב', 'מאפייה', 'ירקות ופירות', 'בשר ודגים', 'שתייה', 'ניקיון', 'טואלטיקה'];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('כללי');
  const [requestedBy, setRequestedBy] = useState('Guy');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const openItems = useMemo(() => items.filter((item) => !item.purchased), [items]);
  const purchasedItems = useMemo(() => items.filter((item) => item.purchased), [items]);

  function addItem(event) {
    event.preventDefault();
    const trimmed = newItem.trim();
    if (!trimmed) return;

    setItems((currentItems) => [
      {
        id: Date.now(),
        name: trimmed,
        quantity: Number(quantity),
        category,
        requestedBy,
        purchased: false,
      },
      ...currentItems,
    ]);

    setNewItem('');
    setQuantity(1);
    setCategory('כללי');
    setRequestedBy('Guy');
  }

  function togglePurchased(id) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item,
      ),
    );
  }

  function deleteItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditingName(item.name);
  }

  function saveEditing(id) {
    const trimmed = editingName.trim();
    if (!trimmed) return;

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, name: trimmed } : item)),
    );
    setEditingId(null);
    setEditingName('');
  }

  function renderItem(item) {
    return (
      <li key={item.id} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
        <button className="status-button" onClick={() => togglePurchased(item.id)} aria-label="שנה סטטוס">
          {item.purchased ? <Undo2 size={18} /> : <Check size={18} />}
        </button>

        <div className="item-content">
          {editingId === item.id ? (
            <div className="edit-row">
              <input value={editingName} onChange={(event) => setEditingName(event.target.value)} autoFocus />
              <button onClick={() => saveEditing(item.id)}>שמור</button>
            </div>
          ) : (
            <>
              <div className="item-title">{item.name}</div>
              <div className="item-meta">
                כמות: {item.quantity} · {item.category} · ביקש/ה: {item.requestedBy}
              </div>
            </>
          )}
        </div>

        <button className="icon-button" onClick={() => startEditing(item)} aria-label="עריכה">
          <Pencil size={18} />
        </button>
        <button className="icon-button danger" onClick={() => deleteItem(item.id)} aria-label="מחיקה">
          <Trash2 size={18} />
        </button>
      </li>
    );
  }

  return (
    <main className="app-shell">
      <section className="card hero">
        <div>
          <p className="eyebrow">המשפחה שלנו</p>
          <h1>קניות שבועיות</h1>
          <p className="subtitle">רשימת קניות משפחתית בעברית, מותאמת לנייד ולמחשב.</p>
        </div>
        <div className="summary">
          <div><strong>{openItems.length}</strong><span>פתוחים</span></div>
          <div><strong>{purchasedItems.length}</strong><span>נקנו</span></div>
        </div>
      </section>

      <form className="card add-form" onSubmit={addItem}>
        <label>
          מוצר
          <input value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="לדוגמה: קוטג׳, ביצים, מלפפונים" />
        </label>

        <div className="form-grid">
          <label>
            כמות
            <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label>
            קטגוריה
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((itemCategory) => <option key={itemCategory}>{itemCategory}</option>)}
            </select>
          </label>
          <label>
            מי ביקש
            <select value={requestedBy} onChange={(event) => setRequestedBy(event.target.value)}>
              {familyMembers.map((member) => <option key={member}>{member}</option>)}
            </select>
          </label>
        </div>

        <button className="primary-button" type="submit"><Plus size={18} /> הוסף לרשימה</button>
      </form>

      <section className="card list-card">
        <div className="section-title">
          <h2>פתוחים</h2>
          <span>{openItems.length} פריטים</span>
        </div>
        <ul className="shopping-list">
          {openItems.length ? openItems.map(renderItem) : <li className="empty-state">אין כרגע פריטים פתוחים.</li>}
        </ul>
      </section>

      <section className="card list-card">
        <div className="section-title">
          <h2>נקנו</h2>
          <span>{purchasedItems.length} פריטים</span>
        </div>
        <ul className="shopping-list">
          {purchasedItems.length ? purchasedItems.map(renderItem) : <li className="empty-state">עדיין לא סומנו פריטים כנקנו.</li>}
        </ul>
      </section>
    </main>
  );
}
