"use client";
import ErrorWrapper from "../../../src/components/errorviews/errorviews";
import Link from "next/link";
import { Button } from "tamagui";

export default function BadGateway() {
  return (
    <ErrorWrapper
      title="502 — Oops, Something Went Wrong"
      imageSrc="/502.svg"
      actions={
        <Button asChild w="100%">
          <Link href="/">Reload</Link>
        </Button>
      }
    />
  );
}
