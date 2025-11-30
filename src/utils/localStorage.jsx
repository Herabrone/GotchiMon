
export function updateLocalStorage(key, stringItem) {
    localStorage.setItem(key, JSON.stringify(stringItem));
}