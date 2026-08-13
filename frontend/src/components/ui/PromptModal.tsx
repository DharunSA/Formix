"use client";

import { FormEvent, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function PromptModal({
  open,
  onClose,
  onSubmit,
  title,
  label,
  initialValue = "",
  submitLabel = "Save",
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label?: string;
  initialValue?: string;
  submitLabel?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      <form onSubmit={handleSubmit}>
        {label && <label className="block text-sm font-medium text-ink-soft mb-2">{label}</label>}
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!value.trim()}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
