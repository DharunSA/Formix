"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { IOS_3D_EMOJIS, type IosEmoji } from "@/lib/ios-emojis";
import { motion } from "framer-motion";

interface ToonPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedToonId?: string;
  selectedImageUrl?: string;
  onSelect: (payload: { toon_id?: string; media_url?: string }) => void;
}

type TabMode = "3d_emojis" | "custom_url";

function EmojiDisplay({ emoji, className }: { emoji: IosEmoji; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center text-3xl select-none`}>
        {emoji.symbol}
      </div>
    );
  }
  return (
    <img
      src={emoji.url}
      alt={emoji.name}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function ToonPickerModal({
  open,
  onOpenChange,
  selectedToonId,
  selectedImageUrl,
  onSelect,
}: ToonPickerModalProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("3d_emojis");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [chosenToonId, setChosenToonId] = useState<string | undefined>(selectedToonId);
  const [customUrl, setCustomUrl] = useState<string>(selectedImageUrl || "");

  const filteredEmojis = IOS_3D_EMOJIS.filter((e) => {
    if (categoryFilter === "all") return true;
    return e.category === categoryFilter;
  });

  const handleSave = () => {
    if (activeTab === "3d_emojis") {
      onSelect({ toon_id: chosenToonId, media_url: undefined });
    } else {
      onSelect({ toon_id: undefined, media_url: customUrl.trim() || undefined });
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    onSelect({ toon_id: undefined, media_url: undefined });
    setChosenToonId(undefined);
    setCustomUrl("");
    onOpenChange(false);
  };

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title="✨ Add iOS 3D Emoji or Image" width={560}>
      <div className="-mt-2 space-y-4">
        <p className="text-xs text-ink-soft">
          Give your questions personality with high-definition 3D Apple-style emoji stickers or custom images.
        </p>

        {/* Mode Tabs */}
        <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("3d_emojis")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              activeTab === "3d_emojis"
                ? "bg-card text-ink shadow-xs border border-border/80 font-bold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            🍎 3D iOS Emojis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom_url")}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
              activeTab === "custom_url"
                ? "bg-card text-ink shadow-xs border border-border/80 font-bold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            🖼️ Custom Image URL
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto pr-1">
          {activeTab === "3d_emojis" ? (
            <div className="space-y-3.5">
              {/* Category Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "All" },
                  { id: "popular", label: "🔥 Popular" },
                  { id: "animals", label: "🦊 Animals" },
                  { id: "objects", label: "💡 Objects" },
                  { id: "expression", label: "🥳 Expression" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 transition-colors ${
                      categoryFilter === c.id
                        ? "bg-ink text-surface font-bold"
                        : "bg-surface border border-border text-ink-soft hover:text-ink"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Emoji Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                {filteredEmojis.map((emoji) => {
                  const isSelected = chosenToonId === emoji.id;
                  return (
                    <motion.button
                      key={emoji.id}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setChosenToonId(emoji.id)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-md ring-2 ring-accent/30"
                          : "border-border/60 bg-surface/40 hover:bg-surface hover:border-border"
                      }`}
                    >
                      <EmojiDisplay emoji={emoji} className="w-12 h-12 object-contain drop-shadow-md" />
                      <span className="text-[10px] font-medium text-ink mt-1.5 truncate w-full text-center">
                        {emoji.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">
                  Image Direct URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full mt-1.5 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
                />
              </div>

              {customUrl.trim() && (
                <div className="mt-3 p-3 bg-surface rounded-2xl border border-border text-center">
                  <span className="text-xs text-ink-soft block mb-2 font-medium">Image Preview</span>
                  <img
                    src={customUrl.trim()}
                    alt="Custom preview"
                    className="max-h-36 max-w-full mx-auto rounded-xl object-contain shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="text-xs text-danger hover:text-danger/80 border-danger/20"
          >
            Remove Media
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleSave}>
              Save Attachment
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
