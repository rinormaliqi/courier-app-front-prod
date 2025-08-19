"use client";
import ErrorWrapper from "../src/components/errorviews/errorviews";
import Link from "next/link";
import { Button } from "tamagui";

export default function NotFound() {
  return (
    <ErrorWrapper
      title="404 — Page Not Found"
      imageSrc="/notfound.svg"
      actions={
        <Button asChild w="100%">
          <Link href="/">Go Home</Link>
        </Button>
      }
    />
  );
}
