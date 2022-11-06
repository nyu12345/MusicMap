import * as SecureStore from "expo-secure-store";

export async function save(key, value) {
    console.log("key: " + key + " value: " + value); 
  await SecureStore.setItemAsync(key, value).catch((err) => console.log(err));
}

export async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    alert("No values stored under that key.");
  }
}
