"use client";
import ErrorWrapper from "../../../src/components/errorviews/errorviews";
import Link from "next/link";
import { Button } from "tamagui";

export default function Unauthorized() {
  return (
    <ErrorWrapper
      title="401 — Unauthorized"
      message="You don’t have access to this page. Please login to continue."
      imageSrc="/unauthorized.svg"
      actions={
        <Button asChild w="100%">
          <Link href="/login">Go to Login</Link>
        </Button>
      }
    />
  );
}
