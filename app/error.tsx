"use client";

import { useEffect } from "react";
import { Button } from "tamagui";
import Link from "next/link";
import ErrorWrapper from "../src/components/errorviews/errorviews";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorWrapper
      title="Something went wrong"
      imageSrc="/error.svg"
      actions={
        <>
          <Button w="100%" onPress={reset}>
            Try Again
          </Button>
          <Button asChild w="100%">
            <Link href="/">Go Home</Link>
          </Button>
        </>
      }
    />
  );
}
