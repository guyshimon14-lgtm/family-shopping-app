const STORAGE_KEY = "family-shopping-app.items.v1";

const form = document.querySelector("#item-form");
const nameInput = document.querySelector("#item-name");
const quantityInput = document.querySelector("#item-quantity");
const categoryInput = document.querySelector("#item-category");
const noteInput = document.querySelector("#item-note");
const list = document.querySelector("#shopping-list");
const template = document.querySelector("#item-template");
const emptyState = document.querySelector("#empty-state");
const summary = document.querySelector("#summary");
const remainingCount = document.querySelector("#remaining-count");
const clearDoneButton = document.querySelector("#clear-done-button");
const shareButton = document.querySelector("#share-button");
const filterButtons = document.querySelectorAll(".filter-button");

let items = loadItems();
let currentFilter = "all";

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  items.unshift({
    id: createId(),
    name,
    quantity: quantityInput.value.trim(),
    category: categoryInput.value,
    note: noteInput.value.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  });

  saveItems();
  form.reset();
  categoryInput.value = "כללי";
  nameInput.focus();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((currentButton) => {
      currentButton.classList.toggle("active", currentButton === button);
    });
    render();
  });
});

clearDoneButton.addEventListener("click", () => {
  const hasDoneItems = items.some((item) => item.done);
  if (!hasDoneItems) return;

  items = items.filter((item) => !item.done);
  saveItems();
  render();
});

shareButton.addEventListener("click", async () => {
  const openItems = items.filter((item) => !item.done);
  const text = buildShareText(openItems.length ? openItems : items);

  if (!text) {
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: "רשימת קניות משפחתית",
        text,
      });
      return;
    }

    await navigator.clipboard.writeText(text);
    showTemporaryShareMessage("הועתק");
  } catch (error) {
    console.warn("Could not share shopping list", error);
    showTemporaryShareMessage("לא ניתן לשתף");
  }
});

function render() {
  const visibleItems = getVisibleItems();
  const openCount = items.filter((item) => !item.done).length;
  const doneCount = items.length - openCount;

  list.innerHTML = "";
  remainingCount.textContent = openCount;
  summary.textContent = getSummaryText(items.length, openCount, doneCount);
  emptyState.hidden = visibleItems.length > 0;

  visibleItems.forEach((item) => {
    const itemNode = template.content.firstElementChild.cloneNode(true);
    const checkbox = itemNode.querySelector(".item-checkbox");
    const name = itemNode.querySelector(".item-name");
    const meta = itemNode.querySelector(".item-meta");
    const removeButton = itemNode.querySelector(".remove-button");

    itemNode.classList.toggle("done", item.done);
    checkbox.checked = item.done;
    name.textContent = item.name;
    meta.textContent = buildMetaText(item);

    checkbox.addEventListener("change", () => {
      toggleItem(item.id, checkbox.checked);
    });

    removeButton.addEventListener("click", () => {
      removeItem(item.id);
    });

    list.append(itemNode);
  });
}

function getVisibleItems() {
  if (currentFilter === "open") {
    return items.filter((item) => !item.done);
  }

  if (currentFilter === "done") {
    return items.filter((item) => item.done);
  }

  return items;
}

function toggleItem(itemId, done) {
  items = items.map((item) => (item.id === itemId ? { ...item, done } : item));
  saveItems();
  render();
}

function removeItem(itemId) {
  items = items.filter((item) => item.id !== itemId);
  saveItems();
  render();
}

function buildMetaText(item) {
  return [item.quantity, item.category, item.note]
    .filter(Boolean)
    .join(" · ");
}

function getSummaryText(total, open, done) {
  if (total === 0) {
    return "אין עדיין פריטים.";
  }

  return `${total} פריטים בסך הכול · ${open} פתוחים · ${done} נקנו`;
}

function buildShareText(itemsToShare) {
  if (!itemsToShare.length) {
    return "";
  }

  const lines = itemsToShare.map((item) => {
    const quantity = item.quantity ? ` (${item.quantity})` : "";
    const note = item.note ? ` — ${item.note}` : "";
    return `• ${item.name}${quantity} · ${item.category}${note}`;
  });

  return [`רשימת קניות משפחתית:`, ...lines].join("\n");
}

function showTemporaryShareMessage(message) {
  const originalText = "שתף רשימה";
  shareButton.textContent = message;
  window.setTimeout(() => {
    shareButton.textContent = originalText;
  }, 1400);
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadItems() {
  try {
    const rawItems = localStorage.getItem(STORAGE_KEY);
    if (!rawItems) return [];

    const parsedItems = JSON.parse(rawItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.warn("Could not load shopping list", error);
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
