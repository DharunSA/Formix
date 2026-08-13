"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Question } from "@/lib/types";
import { QuestionListItem } from "./QuestionListItem";
import { AddQuestionMenu } from "./AddQuestionMenu";
import type { QuestionType } from "@/lib/types";

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onReorder,
  onDelete,
  onAdd,
}: {
  questions: Question[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onReorder: (questions: Question[]) => void;
  onDelete: (id: number) => void;
  onAdd: (type: QuestionType) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    onReorder(arrayMove(questions, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto tf-scrollbar px-2 py-3 space-y-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((q, i) => (
              <QuestionListItem
                key={q.id}
                question={q}
                index={i}
                selected={q.id === selectedId}
                onSelect={() => onSelect(q.id)}
                onDelete={() => onDelete(q.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {questions.length === 0 && (
          <p className="text-xs text-ink-soft px-2 py-6 text-center">No questions yet. Add your first one below.</p>
        )}
      </div>
      <div className="p-3 border-t border-border">
        <AddQuestionMenu onAdd={onAdd} />
      </div>
    </div>
  );
}
