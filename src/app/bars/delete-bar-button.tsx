"use client";

import { deleteBar } from "./actions";

export function DeleteBarButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteBar.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${name}? This can't be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="button danger">
        Delete
      </button>
    </form>
  );
}
