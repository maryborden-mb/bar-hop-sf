# Prompts: data isolation test (PLAN.md test 1)

## Choosing what to do next

```
Data isolation test
```

(Chose to write PLAN.md test 1 before features 9 and 10, since the plan lists it as the part I'm
least sure I can build.)

## Supabase setup

```
which one do i switch off?
```

(Screenshots of the Email provider panel. "Confirm email" turned out to be under
Sign In / Providers → User Signups, not in that panel.)

```
oops i see it! i turned it off
```

```
where is the terminal panel?
```

## Test email addresses

Supabase rejected the made-up `@example.com` test addresses. Chose to use my own address with
`+` tags, set as `TEST_EMAIL` in `.env.local` (which git ignores).

```
shoot sorry it should be saved now!
```

(The Confirm email change hadn't been saved the first time. After saving, all 8 checks passed.)
