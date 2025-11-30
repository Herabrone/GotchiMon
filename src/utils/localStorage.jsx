
export function updateLocalStorage(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
}