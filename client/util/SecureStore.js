import * as SecureStore from "expo-secure-store";

export async function save(key, value) {
  await SecureStore.setItemAsync(key, value).catch((err) => {
    console.log(err);
  });
}

export async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    console.log("No values stored under the given key");
  }
}

export async function deleteValue(key) {
  await SecureStore.deleteItemAsync(key).catch((err) => {
    console.log(err);
  });
}

export async function isAvailable() {
  return SecureStore.isAvailableAsync();
}
