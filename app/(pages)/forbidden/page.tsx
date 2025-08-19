"use client";
import ErrorWrapper from "../../../src/components/errorviews/errorviews";
import Link from "next/link";
import { Button } from "tamagui";

export default function Forbidden() {
  return (
    <ErrorWrapper
      title="403 — Access Denied"
      imageSrc="/403.svg"
      actions={
        <Button asChild w="100%">
          <Link href="/">Return Home</Link>
        </Button>
      }
    />
  );
}
