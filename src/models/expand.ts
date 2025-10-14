import mongoose, { Schema, model } from "mongoose";

interface IExpandSettings {
  Guild: number;
}

export const ExpandSettingsSchema = new mongoose.Schema({
    Guild: {type: Number, required: true, unique: true}
});

export const ExpandSettings = mongoose.model<IExpandSettings>(
  "ExpandSettings",
  ExpandSettingsSchema,
  "ExpandSettings"
);