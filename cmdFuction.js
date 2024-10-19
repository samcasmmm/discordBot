import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'command.json');

const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw new Error('Could not read JSON file');
  }
};

const writeJSONFile = async (filePath, jsonData) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log('JSON file updated successfully!');
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw new Error('Could not write JSON file');
  }
};

export const fetchJSON = async () => {
  try {
    const data = await readJSONFile(filePath);
    console.log('Current JSON data:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch JSON:', error.message);
    return false;
  }
};

export const addKey = async (key, value) => {
  try {
    const data = await readJSONFile(filePath);
    if (data[key]) {
      console.log(`Key "${key}" already exists. Use the update function.`);
      return false;
    } else {
      data[key] = value;
      await writeJSONFile(filePath, data);
      console.log(`Key "${key}" added successfully!`);
      return true;
    }
  } catch (error) {
    console.error(`Failed to add key "${key}":`, error.message);
    return false;
  }
};

export const updateKey = async (oldKey, newKey, newValue) => {
  try {
    const data = await readJSONFile(filePath);
    if (data[oldKey]) {
      delete data[oldKey];
      data[newKey] = newValue;
      await writeJSONFile(filePath, data);
      console.log(
        `Key "${oldKey}" updated to "${newKey}" with value "${newValue}"`
      );
      return true;
    } else {
      console.log(`Key "${oldKey}" does not exist.`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to update key "${oldKey}":`, error.message);
    return false;
  }
};

export const deleteKey = async (key) => {
  try {
    const data = await readJSONFile(filePath);
    if (data[key]) {
      delete data[key];
      await writeJSONFile(filePath, data);
      console.log(`Key "${key}" deleted successfully!`);
      return true;
    } else {
      console.log(`Key "${key}" not found.`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to delete key "${key}":`, error.message);
    return false;
  }
};
