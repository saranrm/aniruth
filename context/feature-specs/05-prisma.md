Prisma is already installed. Add the project data models, Prisma client singleton, and first migration.

## Models

Create `prisma/models/project.prisma`.

Add `Project`:

- owner ID mapped to Clerk user
- name
- optional description
- status enum: `DRAFT`, `ARCHIVED`
- `canvasJsonPath` for future canvas blob storage
- timestamps
- indexes on owner ID and creation date
  Do not add extra fields unless required by Prisma.

## Prisma Client

Create `lib/prisma.ts` as a cached singleton.

Branch by `DATABASE_URL`:

- if it starts with `prisma+postgres://`, use Accelerate
- otherwise use direct `@prisma/adapter-pg`

Cache the client on `global` in development for hot reloads.
27
28 ## Prisma Client
29  
30 Create `lib/prisma.ts` as a cached singleton.
31  
32 Branch by `DATABASE_URL`:
33  
34 - if it starts with `prisma+postgres://`, use Accelerate
35 - otherwise use direct `@prisma/adapter-pg`
36  
37 Cache the client on `global` in development for hot reloads.
38 ## Migration
39  
40 Run the migration and generate the client.
40
41 Run the migration and generate the client.
42  
43 ## Dependencies
44  
45 Already installed:
46  
47 - `prisma`
48 - `@prisma/client`
49 - `@prisma/adapter-pg`
50 - `pg`
51  
52 ## Check When Done
53  
54 - schema has both models with correct relations and indexes
55 - `lib/prisma.ts` exports cached Prisma instance
56 - migration runs successfully
57 - `npm run build` passes
