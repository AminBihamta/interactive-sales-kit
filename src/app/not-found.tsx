import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Centre not found</h1>
      <p className="text-muted-foreground">
        The centre you&apos;re looking for doesn&apos;t exist in our sales kit.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back to location picker
      </Link>
    </div>
  );
}
