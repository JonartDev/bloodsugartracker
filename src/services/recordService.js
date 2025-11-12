// src/services/recordService.js
import { db } from '../firebase';
import { ref, set, push, update, remove, onValue, off, get } from 'firebase/database';

export const recordService = {
  // Create a new record
  async createRecord(userId, recordData) {
    try {
      const recordsRef = ref(db, `users/${userId}/records`);
      const newRecordRef = push(recordsRef);
      const recordWithId = {
        ...recordData,
        id: newRecordRef.key,
        userId: userId,
        createdAt: new Date().toISOString()
      };
      await set(newRecordRef, recordWithId);
      return recordWithId;
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  },

  // Update an existing record
  async updateRecord(userId, recordId, recordData) {
    try {
      const recordRef = ref(db, `users/${userId}/records/${recordId}`);
      const updatedRecord = {
        ...recordData,
        updatedAt: new Date().toISOString()
      };
      await update(recordRef, updatedRecord);
      return updatedRecord;
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  },

  // Delete a record
  async deleteRecord(userId, recordId) {
    try {
      const recordRef = ref(db, `users/${userId}/records/${recordId}`);
      await remove(recordRef);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  },

  // Listen to records changes (realtime updates)
  listenToRecords(userId, callback) {
    const recordsRef = ref(db, `users/${userId}/records`);
    
    const unsubscribe = onValue(recordsRef, (snapshot) => {
      const records = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          records.push(childSnapshot.val());
        });
        // Sort by date, most recent first
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      callback(records);
    }, (error) => {
      console.error('Error listening to records:', error);
      callback([]);
    });

    return () => off(recordsRef, 'value', unsubscribe);
  },

  // Get single record
  async getRecord(userId, recordId) {
    try {
      const recordRef = ref(db, `users/${userId}/records/${recordId}`);
      const snapshot = await get(recordRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting record:', error);
      throw error;
    }
  }
};