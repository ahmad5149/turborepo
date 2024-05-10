"use server";
import { auth, db } from "../../services/firebase-admin";

async function addUser(data) {
  console.log(" file: addDealer.js:6 ~ submitDealer ~ data:", data);
  try {
    if (!data) return { status: 403, message: "Bad Request" };

    const user = await auth.createUser({
      email: data.email,
      emailVerified: false,
      phoneNumber: data.phone,
      password: "secretPassword",
      displayName: data.firstName + " " + data.lastName,
      photoURL: "",
      disabled: false,
    });

    data.uuid = user.uid;

    const usersCollection = db.collection("users");

    await usersCollection.add(data);

    console.log("Data saved to Firestore!");
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    return {
      status: "ERROR",
      message: error,
    };
  }

  return {
    status: "OK",
    message: isInserting
      ? "dealer saved successfully"
      : "dealer updated successfully",
  };
}

async function updateUser(data) {
  console.log(" file: addDealer.js:6 ~ submitDealer ~ data:", data);
  try {
    if (!data) return { status: 403, message: "Bad Request" };

    const user = await auth.createUser({
      email: data.email,
      emailVerified: false,
      phoneNumber: data.phone,
      password: "secretPassword",
      displayName: data.firstName + " " + data.lastName,
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    });

    data.uuid = user.uid;

    const usersCollection = db.collection("users");
    await usersCollection.add(data);

    console.log("Data saved to Firestore!");
  } catch (error) {
    console.error("Error saving data to Firestore:", error);
    return {
      status: "ERROR",
      message: error,
    };
  }

  return {
    status: "OK",
    message: isInserting
      ? "dealer saved successfully"
      : "dealer updated successfully",
  };
}

export { addUser };
