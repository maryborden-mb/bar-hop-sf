"use client";

import { deleteBar } from "./actions";

type Props = {
  id: number;
  name: string;
  returnTo: "/journal" | "/wishlist";
};

export function DeleteBarButton({ id, name, returnTo }: Props) {
  return (
    <form
      action={deleteBar.bind(null, id, returnTo)}
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
