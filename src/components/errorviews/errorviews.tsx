"use client";

import { YStack, Text, Card, Image } from "tamagui";

const ErrorWrapper = ({
  title,
  message,
  imageSrc,
  actions,
}: {
  title: string;
  message?: string;
  imageSrc?: string;
  actions: React.ReactNode;
}) => (
  <YStack f={1} ai="center" jc="center" p="$4" bg="$background">
    <Card elevate p="$4" width="90%" maxWidth={400} ai="center" gap="$3">
      {imageSrc && (
        <Image
          source={{ uri: imageSrc }}
          width={120}
          height={120}
          alt={title}
        />
      )}
      <Text fontSize={24} fontWeight="bold" ta="center">
        {title}
      </Text>
      {message && (
        <Text ta="center" color="$gray10">
          {message}
        </Text>
      )}
      <YStack w="100%" gap="$2" mt="$2">
        {actions}
      </YStack>
    </Card>
  </YStack>
);

export default ErrorWrapper;
