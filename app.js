const FAMILY = [
  { id: "admin", name: "אני", role: "admin", initial: "א" },
  { id: "wife", name: "אשתי", role: "member", initial: "ש" },
  { id: "daughter", name: "הילדה", role: "member", initial: "י" },
];

const CATEGORIES = [
  {
    name: "פירות וירקות",
    words: ["מלפפון", "מלפפונים", "עגבניה", "עגבניות", "בצל", "בצלים", "שום", "תפוח", "תפוחים", "בננה", "בננות", "חסה", "גזר", "גזרים", "פלפל", "פלפלים", "אבוקדו", "לימון", "לימונים", "תפוז", "תפוזים", "ענבים", "אגס", "אגסים", "תות", "תותים"],
  },
  {
    name: "מוצרים יבשים",
    words: ["אורז", "פסטה", "שמן", "קמח", "סוכר", "קפה", "תה", "חומוס", "טחינה", "קורנפלקס", "שימורים", "פתיתים", "קוסקוס", "עדשים", "שעועית", "מלח", "פלפל שחור"],
  },
  {
    name: "בשר",
    words: ["בשר", "סטייק", "סטייקים", "עוף", "עופות", "חזה", "פרגית", "פרגיות", "שניצל", "קבב", "המבורגר", "נקניקיות", "טחון", "בקר"],
  },
  {
    name: "דגים",
    words: ["דג", "דגים", "סלמון", "טונה", "אמנון", "מושט", "נסיכת", "בקלה"],
  },
  {
    name: "לחמים",
    words: ["לחם", "לחמים", "לחמניה", "לחמניות", "חלה", "חלות", "פיתה", "פיתות", "באגט", "בורקס"],
  },
  {
    name: "מוצרי חלב",
    words: ["חלב", "גבינה", "גבינות", "קוטג", "קוטג'", "יוגורט", "יוגורטים", "חמאה", "שמנת", "ביצים", "מעדן", "מעדנים"],
  },
  {
    name: "מוצרי ניקוי",
    words: ["אקונומיקה", "נייר", "טואלט", "מגבונים", "אבקת", "כביסה", "מרכך", "כלים", "ספוג", "סמרטוט", "רצפה", "ניקוי", "פיירי"],
  },
  {
    name: "מוצרי אמבטיה",
    words: ["סבון", "שמפו", "מרכך", "דאודורנט", "משחת", "שיניים", "מברשת", "גילוח", "קרם", "תחבושות", "טמפונים"],
  },
];

const numberWords = new Map([
  ["אחד", 1],
  ["אחת", 1],
  ["שני", 2],
  ["שתי", 2],
  ["שניים", 2],
  ["שתיים", 2],
  ["שלוש", 3],
  ["שלושה", 3],
  ["ארבע", 4],
  ["ארבעה", 4],
  ["חמש", 5],
  ["חמישה", 5],
  ["שש", 6],
  ["שישה", 6],
  ["שבע", 7],
  ["שבעה", 7],
  ["שמונה", 8],
  ["תשע", 9],
  ["תשעה", 9],
  ["עשר", 10],
  ["עשרה", 10],
  ["קילו", 1],
]);

const units = new Set(["יחידה", "יחידות", "חבילה", "חבילות", "בקבוק", "בקבוקים", "קילו", "קג", "ק״ג", "גרם", "ליטר", "ליטרים", "שישייה", "שישיית"]);
const fillers = new Set(["אני", "רוצה", "רוצים", "צריך", "צריכה", "צריכים", "להוסיף", "תוסיף", "תוסיפי", "תקנה", "תקני", "בבקשה", "גם", "עוד", "את", "לי", "לנו", "ו"]);
const weekdayMap = new Map([
  ["ראשון", 0],
  ["שני", 1],
  ["שלישי", 2],
  ["רביעי", 3],
  ["חמישי", 4],
  ["שישי", 5],
  ["שבת", 6],
]);

const ADMIN_EMAIL_PREFIX = "guyshimon14";
const firebaseConfig = {
  apiKey: "AIzaSyCIhY0XWRQEHSTXTPyOWfnQAzUkBZ-opgI",
  authDomain: "family-app-205e1.firebaseapp.com",
  projectId: "family-app-205e1",
  storageBucket: "family-app-205e1.firebasestorage.app",
  messagingSenderId: "1025187216217",
  appId: "1:1025187216217:web:f22fc9b3510bdfdc6c6a48",
};

let firebaseApi = null;
let currentUser = null;
let appDocUnsubscribe = null;
let isApplyingRemoteState = false;

const state = {
  activeUserId: localStorage.getItem("family-active-user") || "admin",
  items: JSON.parse(localStorage.getItem("family-items-v1") || "[]"),
  deadline: localStorage.getItem("family-shopping-deadline-v1") || "",
  isClosed: localStorage.getItem("family-shopping-closed-v1") === "true",
  accessRequests: JSON.parse(localStorage.getItem("family-access-requests-v1") || "[]"),
  oneTimeApprovals: JSON.parse(localStorage.getItem("family-one-time-approvals-v1") || "{}"),
  pendingDuplicate: null,
  pendingItems: [],
  focusItemId: "",
};

const els = {
  authCard: document.querySelector("#authCard"),
  authForm: document.querySelector("#authForm"),
  authMessage: document.querySelector("#authMessage"),
  emailInput: document.querySelector("#emailInput"),
  passwordInput: document.querySelector("#passwordInput"),
  signOutButton: document.querySelector("#signOutButton"),
  tabsNav: document.querySelector("#tabsNav"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  statusTitle: document.querySelector("#statusTitle"),
  statusText: document.querySelector("#statusText"),
  deadlineLine: document.querySelector("#deadlineLine"),
  speechText: document.querySelector("#speechText"),
  voiceButton: document.querySelector("#voiceButton"),
  voiceLabel: document.querySelector("#voiceLabel"),
  requestOpenButton: document.querySelector("#requestOpenButton"),
  messageBox: document.querySelector("#messageBox"),
  duplicateCard: document.querySelector("#duplicateCard"),
  duplicateTitle: document.querySelector("#duplicateTitle"),
  duplicateText: document.querySelector("#duplicateText"),
  confirmDuplicateButton: document.querySelector("#confirmDuplicateButton"),
  cancelDuplicateButton: document.querySelector("#cancelDuplicateButton"),
  confirmCard: document.querySelector("#confirmCard"),
  confirmList: document.querySelector("#confirmList"),
  cancelItemsButton: document.querySelector("#cancelItemsButton"),
  managerWrap: document.querySelector("#managerWrap"),
  managerButton: document.querySelector("#managerButton"),
  managerActions: document.querySelector("#managerActions"),
  closeDeadlineButton: document.querySelector("#closeDeadlineButton"),
  openListButton: document.querySelector("#openListButton"),
  adminMissingButton: document.querySelector("#adminMissingButton"),
  accessRequestsList: document.querySelector("#accessRequestsList"),
  adminCommandText: document.querySelector("#adminCommandText"),
  shortagesList: document.querySelector("#shortagesList"),
  shoppingList: document.querySelector("#shoppingList"),
  categoryTemplate: document.querySelector("#categoryTemplate"),
  itemTemplate: document.querySelector("#itemTemplate"),
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let shoppingRecognition = null;
let adminRecognition = null;
let shoppingIsListening = false;
let adminIsListening = false;

function getActiveUser() {
  if (currentUser) {
    const email = currentUser.email || "";
    const name = email.split("@")[0] || "משתמש";
    const isAdmin = email.toLowerCase().startsWith(ADMIN_EMAIL_PREFIX.toLowerCase());
    return {
      id: currentUser.uid,
      name,
      role: isAdmin ? "admin" : "member",
      initial: name.slice(0, 1),
      email,
    };
  }
  return FAMILY.find((user) => user.id === state.activeUserId) || FAMILY[0];
}

function save() {
  localStorage.setItem("family-active-user", state.activeUserId);
  localStorage.setItem("family-items-v1", JSON.stringify(state.items));
  localStorage.setItem("family-shopping-deadline-v1", state.deadline);
  localStorage.setItem("family-shopping-closed-v1", String(state.isClosed));
  localStorage.setItem("family-access-requests-v1", JSON.stringify(state.accessRequests));
  localStorage.setItem("family-one-time-approvals-v1", JSON.stringify(state.oneTimeApprovals));
  if (firebaseApi && currentUser && !isApplyingRemoteState) persistCloudState();
}

function appPayload() {
  return {
    items: state.items,
    deadline: state.deadline,
    isClosed: state.isClosed,
    accessRequests: state.accessRequests,
    oneTimeApprovals: state.oneTimeApprovals,
    updatedAt: Date.now(),
    updatedBy: currentUser ? currentUser.email : "",
  };
}

function applyRemoteState(data) {
  isApplyingRemoteState = true;
  state.items = Array.isArray(data.items) ? data.items : [];
  state.deadline = data.deadline || "";
  state.isClosed = Boolean(data.isClosed);
  state.accessRequests = Array.isArray(data.accessRequests) ? data.accessRequests : [];
  state.oneTimeApprovals = data.oneTimeApprovals && typeof data.oneTimeApprovals === "object" ? data.oneTimeApprovals : {};
  localStorage.setItem("family-items-v1", JSON.stringify(state.items));
  localStorage.setItem("family-shopping-deadline-v1", state.deadline);
  localStorage.setItem("family-shopping-closed-v1", String(state.isClosed));
  localStorage.setItem("family-access-requests-v1", JSON.stringify(state.accessRequests));
  localStorage.setItem("family-one-time-approvals-v1", JSON.stringify(state.oneTimeApprovals));
  isApplyingRemoteState = false;
}

function persistCloudState() {
  if (!firebaseApi || !currentUser) return;
  firebaseApi.setDoc(firebaseApi.appDocRef, appPayload(), { merge: true }).catch(() => {
    showMessage("לא הצלחתי לשמור בענן כרגע. בדוק חיבור או הרשאות Firestore.");
  });
}

function createId() {
  return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cleanWord(word) {
  return word.replace(/[.,!?;:"״]/g, "").replace(/^ו[-־]?(?=\S)/, "").trim();
}

function singularize(name) {
  const direct = new Map([
    ["מלפפונים", "מלפפון"],
    ["עגבניות", "עגבניה"],
    ["תפוחים", "תפוח"],
    ["בננות", "בננה"],
    ["בצלים", "בצל"],
    ["גזרים", "גזר"],
    ["פלפלים", "פלפל"],
    ["לימונים", "לימון"],
    ["גבינות", "גבינה"],
    ["יוגורטים", "יוגורט"],
    ["לחמניות", "לחמניה"],
    ["פיתות", "פיתה"],
  ]);
  const cleaned = name.trim();
  return direct.get(cleaned) || cleaned;
}

function normalizeItemName(name) {
  return singularize(name.split(" ").map(cleanWord).filter(Boolean).join(" ")).trim();
}

function quantityFromWord(word) {
  const clean = cleanWord(word);
  const numeric = Number(clean);
  if (!Number.isNaN(numeric) && numeric > 0) return numeric;
  return numberWords.get(clean) || 0;
}

function isKnownProductWord(word) {
  const normalized = normalizeItemName(cleanWord(word));
  return CATEGORIES.some((category) => category.words.some((product) => normalizeItemName(product) === normalized));
}

function hasProductCandidate(words) {
  return words.some((word) => {
    const clean = cleanWord(word);
    return clean && !quantityFromWord(clean) && !units.has(clean) && !fillers.has(clean);
  });
}

function parseProductPart(part) {
  const words = part.split(/\s+/).map(cleanWord).filter(Boolean);
  let quantity = 0;
  const nameWords = [];

  words.forEach((word) => {
    const amount = quantityFromWord(word);
    if (amount) {
      quantity += amount;
      return;
    }
    if (units.has(word) || fillers.has(word)) return;
    nameWords.push(word);
  });

  const name = normalizeItemName(nameWords.join(" "));
  return {
    quantity: quantity || 1,
    name,
    category: detectCategory(name),
  };
}

function splitShoppingText(text) {
  const normalized = text.replace(/[.;:]/g, ",").replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const parts = [];

  normalized.split(",").forEach((chunk) => {
    const words = chunk.split(/\s+/).map(cleanWord).filter(Boolean);
    let current = [];

    words.forEach((word) => {
      const startsNewByQuantity = current.length > 0 && hasProductCandidate(current) && quantityFromWord(word);
      if (startsNewByQuantity) {
        parts.push(current.join(" "));
        current = [];
      }
      current.push(word);
    });

    if (current.length > 0) parts.push(current.join(" "));
  });

  return parts.map((part) => part.trim()).filter(Boolean);
}

function parseShoppingText(text) {
  return splitShoppingText(text)
    .map(parseProductPart)
    .filter((item) => item.name.length > 1);
}

function detectCategory(name) {
  const normalized = normalizeItemName(name);
  const category = CATEGORIES.find((group) => group.words.some((word) => normalizeItemName(word) === normalized || normalized.includes(normalizeItemName(word))));
  return category ? category.name : "כללי";
}

function sameProduct(a, b) {
  return normalizeItemName(a) === normalizeItemName(b);
}

function isListClosed() {
  if (state.isClosed) return true;
  if (!state.deadline) return false;
  return Date.now() >= new Date(state.deadline).getTime();
}

function hasTemporaryAccess() {
  const user = getActiveUser();
  return user.role === "admin" || Boolean(state.oneTimeApprovals[user.id]);
}

function consumeTemporaryAccess() {
  const user = getActiveUser();
  if (user.role === "admin") return;
  delete state.oneTimeApprovals[user.id];
}

function findExisting(item) {
  return state.items.find((existing) => sameProduct(existing.name, item.name));
}

function addOrMergeItem(item, forceMerge = false) {
  const existing = findExisting(item);
  if (existing && !forceMerge) {
    state.pendingDuplicate = { incoming: item, existingId: existing.id };
    state.focusItemId = existing.id;
    render();
    window.setTimeout(() => scrollToItem(existing.id), 80);
    return false;
  }

  if (existing) {
    existing.quantity += item.quantity;
    existing.done = false;
    existing.updatedBy = getActiveUser().name;
    existing.updatedAt = Date.now();
    state.focusItemId = existing.id;
  } else {
    state.items.push({
      id: createId(),
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      done: false,
      image: "",
      status: "pending",
      createdBy: getActiveUser().name,
      updatedBy: getActiveUser().name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  save();
  return true;
}

function addFromInput() {
  hideMessage();
  if (isListClosed() && !hasTemporaryAccess()) {
    showMessage("הרשימה סגורה. אפשר לשלוח למנהל בקשת פתיחה.");
    return;
  }

  const parsed = parseShoppingText(els.speechText.value);
  if (parsed.length === 0) {
    showMessage("לא זיהיתי מוצר. נסה למשל: 2 מלפפונים.");
    return;
  }

  state.pendingItems = parsed;
  render();
}

function approvePendingItems() {
  if (state.pendingItems.length === 0) return;
  const addedAll = state.pendingItems.every((item) => addOrMergeItem(item, true));
  if (addedAll) {
    state.pendingItems = [];
    state.pendingDuplicate = null;
    if (isListClosed()) consumeTemporaryAccess();
    els.confirmCard.hidden = true;
    els.confirmList.innerHTML = "";
    els.speechText.value = "";
    hideMessage();
    render();
  }
}

function approvePendingItem(index) {
  const item = state.pendingItems[index];
  if (!item) return;
  addOrMergeItem(item, true);
  state.pendingItems.splice(index, 1);
  if (state.pendingItems.length === 0) {
    state.pendingDuplicate = null;
    if (isListClosed()) consumeTemporaryAccess();
    els.speechText.value = "";
    hideMessage();
  }
  save();
  render();
}

function cancelPendingItems() {
  state.pendingItems = [];
  els.confirmCard.hidden = true;
  els.confirmList.innerHTML = "";
  els.speechText.value = "";
  render();
}

function confirmDuplicate() {
  if (!state.pendingDuplicate) return;
  addOrMergeItem(state.pendingDuplicate.incoming, true);
  state.pendingDuplicate = null;
  els.speechText.value = "";
  render();
  showMessage("הכמות נוספה למוצר הקיים.");
}

function cancelDuplicate() {
  state.pendingDuplicate = null;
  render();
}

function scrollToItem(id) {
  const node = document.querySelector(`[data-item-id="${id}"]`);
  if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
}

function formatDeadline() {
  if (!state.deadline) return "";
  const date = new Date(state.deadline);
  const weekday = date.toLocaleDateString("he-IL", { weekday: "long" });
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${weekday} ב${hour}:${minute}`;
}

function nextWeekday(dayIndex, hour) {
  const date = new Date();
  const diff = (dayIndex - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  date.setHours(hour, 0, 0, 0);
  if (date <= new Date()) date.setDate(date.getDate() + 7);
  return date;
}

function tomorrowAt(hour) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function parseHour(clean) {
  const numberHour = clean.match(/(?:שעה|בשעה|ב)[-־]?\s*(\d{1,2})/);
  let hour = numberHour ? Number(numberHour[1]) : 20;
  if (!numberHour) {
    const hourEntry = [...numberWords.entries()]
      .filter(([, value]) => value >= 1 && value <= 12)
      .find(([word]) => clean.includes(word));
    if (hourEntry) hour = hourEntry[1];
  }
  const afternoonWords = ["בערב", "אחר הצהריים", "אחהצ", "אחה\"צ", "צהריים", "בצהריים", "הצהריים", "צבריים", "הצבריים"];
  if (afternoonWords.some((word) => clean.includes(word)) && hour < 12) hour += 12;
  return hour;
}

function showLocalNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") new Notification(title, { body });
    });
  }
}

function notifyMembers(title, body) {
  showLocalNotification(title, body);
}

function parseAdminCommand(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  if (clean.includes("פתח")) return { action: "open" };

  const dayEntry = [...weekdayMap.entries()].find(([day]) => clean.includes(day));
  const hour = parseHour(clean);
  const deadline = clean.includes("מחר")
    ? tomorrowAt(hour).toISOString()
    : dayEntry
      ? nextWeekday(dayEntry[1], hour).toISOString()
      : "";

  if (clean.includes("סגור") || clean.includes("תיסגר") || clean.includes("לסגור") || dayEntry || clean.includes("מחר")) {
    return {
      action: "close_until",
      deadline,
    };
  }
  return null;
}

function applyAdminCommand() {
  if (getActiveUser().role !== "admin") return;
  const command = parseAdminCommand(els.adminCommandText.value);
  if (!command) {
    showMessage("לא זיהיתי יום ושעת סגירה. לחץ שוב על מנהל ונסה לומר יום ושעה.");
    return;
  }

  if (command.action === "open") {
    state.isClosed = false;
    state.deadline = "";
    els.adminCommandText.value = "";
    save();
    render();
    showMessage("הרשימה נפתחה מחדש.");
    return;
  }

  state.isClosed = false;
  state.deadline = command.deadline;
  els.adminCommandText.value = "";
  save();
  render();
  if (command.deadline) notifyMembers("מועד סגירת הרשימה", `הרשימה תיסגר ב${formatDeadline()}`);
  if (command.deadline) hideMessage();
}

function openListNow() {
  if (getActiveUser().role !== "admin") return;
  state.isClosed = false;
  state.deadline = "";
  state.oneTimeApprovals = {};
  els.adminCommandText.value = "";
  save();
  render();
  showMessage("הרשימה נפתחה.");
}

function requestOpenAccess() {
  const user = getActiveUser();
  if (user.role === "admin") return;
  const exists = state.accessRequests.some((request) => request.userId === user.id);
  if (!exists) {
    state.accessRequests.push({ id: createId(), userId: user.id, name: user.name, createdAt: Date.now() });
    save();
  }
  showLocalNotification("בקשת פתיחה", `${user.name} מבקש להוסיף מוצרים לרשימה.`);
  showMessage("הבקשה נשלחה למנהל.");
  render();
}

function approveAccessRequest(requestId) {
  if (getActiveUser().role !== "admin") return;
  const request = state.accessRequests.find((item) => item.id === requestId);
  if (!request) return;
  state.oneTimeApprovals[request.userId] = true;
  state.accessRequests = state.accessRequests.filter((item) => item.id !== requestId);
  save();
  render();
  showMessage(`אושר ל${request.name} להוסיף מוצרים.`);
}

function showMessage(text) {
  els.messageBox.hidden = false;
  els.messageBox.textContent = text;
}

function hideMessage() {
  els.messageBox.hidden = true;
  els.messageBox.textContent = "";
}

function showAuthMessage(text) {
  els.authMessage.hidden = false;
  els.authMessage.textContent = text;
}

function hideAuthMessage() {
  els.authMessage.hidden = true;
  els.authMessage.textContent = "";
}

function renderAuth() {
  const signedIn = Boolean(currentUser);
  els.authCard.hidden = signedIn;
  els.tabsNav.hidden = !signedIn;
  els.signOutButton.hidden = !signedIn;
  els.views.forEach((view) => {
    if (!signedIn) {
      view.hidden = true;
      return;
    }
    view.hidden = false;
  });
  if (signedIn) render();
}

async function initFirebase() {
  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = appModule.initializeApp(firebaseConfig);
    const auth = authModule.getAuth(app);
    const db = firestoreModule.getFirestore(app);
    const appDocRef = firestoreModule.doc(db, "families", "main");
    firebaseApi = {
      auth,
      db,
      appDocRef,
      signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
      signOut: authModule.signOut,
      onAuthStateChanged: authModule.onAuthStateChanged,
      onSnapshot: firestoreModule.onSnapshot,
      setDoc: firestoreModule.setDoc,
    };
    firebaseApi.onAuthStateChanged(auth, handleAuthState);
  } catch {
    showAuthMessage("לא הצלחתי לטעון Firebase. בדוק חיבור אינטרנט ורענן את הדף.");
  }
}

function handleAuthState(user) {
  currentUser = user;
  if (appDocUnsubscribe) {
    appDocUnsubscribe();
    appDocUnsubscribe = null;
  }

  if (!user) {
    renderAuth();
    return;
  }

  hideAuthMessage();
  appDocUnsubscribe = firebaseApi.onSnapshot(firebaseApi.appDocRef, (snapshot) => {
    if (!snapshot.exists()) {
      persistCloudState();
      renderAuth();
      return;
    }
    applyRemoteState(snapshot.data());
    renderAuth();
  }, () => {
    showMessage("אין הרשאה לקרוא את הרשימה. צריך לעדכן Firestore Rules.");
    renderAuth();
  });
}

async function signIn(event) {
  event.preventDefault();
  hideAuthMessage();
  const email = els.emailInput.value.trim();
  const password = els.passwordInput.value;
  try {
    await firebaseApi.signInWithEmailAndPassword(firebaseApi.auth, email, password);
    els.passwordInput.value = "";
  } catch (error) {
    showAuthMessage(getAuthErrorMessage(error));
  }
}

function getAuthErrorMessage(error) {
  const code = error && error.code ? error.code : "";
  const messages = {
    "auth/invalid-email": "האימייל לא תקין. צריך להקליד אימייל מלא, למשל guyshimon14@gmail.com.",
    "auth/user-not-found": "המשתמש לא קיים ב-Firebase. צריך להוסיף אותו במסך Authentication.",
    "auth/wrong-password": "הסיסמה לא נכונה. אפשר לאפס או ליצור סיסמה חדשה ב-Firebase.",
    "auth/invalid-credential": "האימייל או הסיסמה לא נכונים. בדוק שהקלדת אימייל מלא ואת הסיסמה שהוגדרה ב-Firebase.",
    "auth/unauthorized-domain": "הדומיין של Netlify לא מורשה ב-Firebase. צריך להוסיף אותו ב-Authentication > Settings > Authorized domains.",
    "auth/network-request-failed": "אין חיבור תקין ל-Firebase כרגע. בדוק אינטרנט ורענן את הדף.",
  };
  return messages[code] || `הכניסה נכשלה. קוד שגיאה: ${code || "לא ידוע"}.`;
}

async function signOut() {
  if (!firebaseApi) return;
  await firebaseApi.signOut(firebaseApi.auth);
}

function configureRecognition(target, button, label, idleText, onDone, options = {}) {
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  recognition.lang = "he-IL";
  recognition.interimResults = false;
  recognition.continuous = Boolean(options.continuous);
  let gotResult = false;
  recognition.addEventListener("result", (event) => {
    const phrases = [];
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      if (event.results[i].isFinal) phrases.push(event.results[i][0].transcript);
    }
    if (phrases.length > 0) {
      target.value = `${target.value} ${phrases.join(" ")}`.replace(/\s+/g, " ").trim();
      gotResult = true;
    }
  });
  recognition.addEventListener("end", () => {
    button.classList.remove("listening");
    button.textContent = idleText;
    if (button === els.voiceButton) shoppingIsListening = false;
    if (button === els.managerButton) adminIsListening = false;
    if (gotResult && onDone) onDone();
    gotResult = false;
  });
  recognition.addEventListener("error", () => {
    button.classList.remove("listening");
    button.textContent = idleText;
    if (button === els.voiceButton) shoppingIsListening = false;
    if (button === els.managerButton) adminIsListening = false;
    showMessage("המיקרופון לא זמין כרגע. אפשר להקליד את אותו משפט.");
  });
  return recognition;
}

function toggleRecognition(recognition, button, listeningText, idleText, fallback, kind) {
  hideMessage();
  if (!recognition) {
    fallback.focus();
    showMessage("בדפדפן הזה אין זיהוי קול. אפשר להקליד וללחוץ הוסף.");
    return;
  }

  const isListening = kind === "shopping" ? shoppingIsListening : adminIsListening;
  if (isListening) {
    recognition.stop();
    return;
  }

  if (kind === "shopping") {
    state.pendingItems = [];
    els.speechText.value = "";
  } else {
    els.adminCommandText.value = "";
  }

  button.classList.add("listening");
  button.textContent = listeningText;
  try {
    if (kind === "shopping") shoppingIsListening = true;
    if (kind === "admin") adminIsListening = true;
    recognition.start();
  } catch {
    button.classList.remove("listening");
    button.textContent = idleText;
    if (kind === "shopping") shoppingIsListening = false;
    if (kind === "admin") adminIsListening = false;
  }
}

function idleTextForButton(button) {
  return button === els.voiceButton ? "מה אתם רוצים לקנות?" : "מנהל";
}

function renderStatus() {
  const closed = isListClosed();
  const deadline = formatDeadline();
  const user = getActiveUser();
  const isAdmin = user.role === "admin";
  els.statusTitle.textContent = closed ? "הרשימה סגורה" : "הרשימה פתוחה";
  els.statusText.textContent = closed && hasTemporaryAccess()
    ? "יש לך אישור זמני להוסיף מוצרים."
    : closed
      ? "לא ניתן להוסיף מוצרים כרגע."
      : "אפשר להוסיף מוצרים בקול או בהקלדה.";
  els.deadlineLine.hidden = !deadline;
  els.deadlineLine.textContent = deadline ? `הרשימה תיסגר ב${deadline}` : "";
  els.managerWrap.hidden = !isAdmin;
  els.managerActions.hidden = !isAdmin || els.managerActions.hidden;
  if (!isAdmin) {
    els.shortagesList.hidden = true;
    els.accessRequestsList.hidden = true;
  }
  els.requestOpenButton.hidden = isAdmin || !closed || hasTemporaryAccess();
  renderAccessRequests();
}

function renderPendingItems() {
  els.confirmCard.hidden = state.pendingItems.length === 0;
  els.confirmList.innerHTML = "";
  state.pendingItems.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "confirm-row";
    const title = document.createElement("span");
    title.textContent = `${item.quantity} ${item.name}`;
    const approve = document.createElement("button");
    approve.className = "primary-button";
    approve.type = "button";
    approve.textContent = "אשר העלאה";
    approve.addEventListener("click", () => approvePendingItem(index));
    row.append(title, approve);
    els.confirmList.append(row);
  });
}

function renderAccessRequests() {
  if (!els.accessRequestsList) return;
  const isAdmin = getActiveUser().role === "admin";
  els.accessRequestsList.hidden = !isAdmin || state.accessRequests.length === 0;
  els.accessRequestsList.innerHTML = "";
  if (!isAdmin || state.accessRequests.length === 0) return;
  state.accessRequests.forEach((request) => {
    const row = document.createElement("article");
    row.className = "request-row";
    const title = document.createElement("span");
    title.textContent = `${request.name} מבקש פתיחה`;
    const approve = document.createElement("button");
    approve.className = "primary-button";
    approve.type = "button";
    approve.textContent = "אשר";
    approve.addEventListener("click", () => approveAccessRequest(request.id));
    row.append(title, approve);
    els.accessRequestsList.append(row);
  });
}

function renderDuplicate() {
  const duplicate = state.pendingDuplicate;
  els.duplicateCard.hidden = !duplicate;
  if (!duplicate) return;
  const existing = state.items.find((item) => item.id === duplicate.existingId);
  els.duplicateTitle.textContent = `${duplicate.incoming.name} כבר ברשימה`;
  els.duplicateText.textContent = existing ? `כרגע רשום ${existing.quantity}. להוסיף עוד ${duplicate.incoming.quantity}?` : "להוסיף כמות למוצר הקיים?";
}

function renderShoppingList() {
  els.shoppingList.innerHTML = "";
  const grouped = new Map();
  state.items
    .slice()
    .map((item) => {
      item.category = detectCategory(item.name);
      return item;
    })
    .filter((item) => (item.status || (item.done ? "bought" : "pending")) === "pending")
    .sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category) || a.name.localeCompare(b.name, "he"))
    .forEach((item) => {
      if (!grouped.has(item.category)) grouped.set(item.category, []);
      grouped.get(item.category).push(item);
    });

  grouped.forEach((items, categoryName) => {
    const categoryNode = els.categoryTemplate.content.cloneNode(true);
    categoryNode.querySelector("h2").textContent = categoryName;
    const list = categoryNode.querySelector(".items");
    items.forEach((item) => {
      if (!item.status) item.status = item.done ? "bought" : "pending";
      const itemNode = els.itemTemplate.content.cloneNode(true);
      const row = itemNode.querySelector(".item");
      const boughtButton = itemNode.querySelector(".bought-button");
      const missingButton = itemNode.querySelector(".missing-button");
      row.dataset.itemId = item.id;
      row.classList.toggle("bought", item.status === "bought");
      row.classList.toggle("highlight", state.focusItemId === item.id);
      itemNode.querySelector("strong").textContent = `${item.quantity} ${item.name}`;
      itemNode.querySelector("span").hidden = true;
      boughtButton.classList.toggle("active", item.status === "bought");
      missingButton.classList.toggle("active", item.status === "missing");
      const photo = itemNode.querySelector(".item-photo");
      const photoInput = itemNode.querySelector(".photo-input");
      const photoButton = itemNode.querySelector(".photo-button");
      const removeButton = itemNode.querySelector(".remove-button");
      if (item.image) {
        photo.src = item.image;
        photo.hidden = false;
      }
      boughtButton.addEventListener("click", () => {
        item.status = "bought";
        item.done = true;
        save();
        render();
        if (!els.shortagesList.hidden) renderMissingList();
      });
      missingButton.addEventListener("click", () => {
        item.status = "missing";
        item.done = false;
        save();
        render();
        if (!els.shortagesList.hidden) renderMissingList();
      });
      photoButton.addEventListener("click", () => photoInput.click());
      photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          item.image = reader.result;
          save();
          render();
        });
        reader.readAsDataURL(file);
      });
      removeButton.addEventListener("click", () => {
        state.items = state.items.filter((candidate) => candidate.id !== item.id);
        save();
        render();
      });
      list.append(itemNode);
    });
    els.shoppingList.append(categoryNode);
  });

  const openItems = state.items.filter((item) => (item.status || (item.done ? "bought" : "pending")) === "pending");
  if (openItems.length === 0) {
    els.shoppingList.innerHTML = '<section class="maintenance-hero"><strong>הרשימה ריקה</strong><span>התחילו עם משפט כמו: 2 מלפפונים.</span></section>';
  }
}

function categoryOrder(name) {
  const index = CATEGORIES.findIndex((category) => category.name === name);
  return index === -1 ? CATEGORIES.length : index;
}

function renderMissingList() {
  if (getActiveUser().role !== "admin") {
    els.shortagesList.hidden = true;
    return;
  }
  const missing = state.items.filter((item) => item.status === "missing");
  els.shortagesList.hidden = false;
  if (missing.length === 0) {
    els.shortagesList.innerHTML = '<div class="shortage-empty">אין חוסרים כרגע.</div>';
    return;
  }
  els.shortagesList.innerHTML = "";
  missing.forEach((item) => {
    const row = document.createElement("article");
    row.className = "shortage-row";
    const title = document.createElement("strong");
    title.textContent = `${item.quantity} ${item.name}`;
    const actions = document.createElement("div");
    actions.className = "status-actions";
    const bought = document.createElement("button");
    bought.className = "bought-button";
    bought.type = "button";
    bought.textContent = "נקנה";
    bought.addEventListener("click", () => {
      item.status = "bought";
      item.done = true;
      save();
      render();
      renderMissingList();
    });
    const clearButton = document.createElement("button");
    clearButton.className = "clear-shortage-button";
    clearButton.type = "button";
    clearButton.textContent = "נקה";
    clearButton.addEventListener("click", () => {
      item.status = "pending";
      item.done = false;
      save();
      render();
      renderMissingList();
    });
    actions.append(bought, clearButton);
    row.append(title, actions);
    els.shortagesList.append(row);
  });
}

function toggleMissingList() {
  if (getActiveUser().role !== "admin") return;
  if (!els.shortagesList.hidden) {
    els.shortagesList.hidden = true;
    return;
  }
  renderMissingList();
}

function render() {
  renderStatus();
  renderDuplicate();
  renderPendingItems();
  renderShoppingList();
}

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.tabs.forEach((candidate) => candidate.classList.toggle("active", candidate === tab));
    els.views.forEach((view) => view.classList.toggle("active", view.id === `${tab.dataset.view}View`));
  });
});

els.confirmDuplicateButton.addEventListener("click", confirmDuplicate);
els.cancelDuplicateButton.addEventListener("click", cancelDuplicate);
els.cancelItemsButton.addEventListener("click", cancelPendingItems);
els.adminMissingButton.addEventListener("click", toggleMissingList);
els.openListButton.addEventListener("click", openListNow);
els.requestOpenButton.addEventListener("click", requestOpenAccess);
els.authForm.addEventListener("submit", signIn);
els.signOutButton.addEventListener("click", signOut);
els.managerButton.addEventListener("click", () => {
  els.managerActions.hidden = !els.managerActions.hidden;
});

els.adminCommandText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    applyAdminCommand();
  }
});

shoppingRecognition = configureRecognition(els.speechText, els.voiceButton, els.voiceButton, "דבר", addFromInput, { continuous: true });
adminRecognition = configureRecognition(els.adminCommandText, els.managerButton, els.managerButton, "מנהל", applyAdminCommand);

els.voiceButton.addEventListener("click", () => toggleRecognition(shoppingRecognition, els.voiceButton, "הוסף מוצרים לאישור", "דבר", els.speechText, "shopping"));
els.closeDeadlineButton.addEventListener("click", () => toggleRecognition(adminRecognition, els.managerButton, "מקשיב...", "מנהל", els.adminCommandText, "admin"));

renderAuth();
initFirebase();

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The app still works online if the browser blocks service workers.
    });
  });
}
