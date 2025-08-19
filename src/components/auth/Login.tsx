"use client";

import {
  Button,
  Form,
  Input,
  Spinner,
  Text,
  XStack,
  YStack,
  useMedia,
} from "tamagui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useLanguage } from "@/src/contexts/LanguageContext";

export const LoginForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const media = useMedia();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: email,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      if (!data.access_token || !data.refresh_token) {
        throw new Error(t("no_token_received"));
      }
      // Use AuthContext to handle tokens
      await login({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      if (isMounted) router.push("/dashboard");
    } catch (err: unknown) {
      let errorKey = "login_failed";

      if (err instanceof Error) {
        if (err.message.includes("401")) errorKey = "invalid_credentials";
        else if (err.message.includes("Network")) errorKey = "network_error";
        else if (err.message.includes("no_token"))
          errorKey = "no_token_received";

        setError(t(errorKey));
        console.error("Login error:", err);
      } else {
        // fallback for non-Error types
        console.error("Unexpected error type:", err);
        setError(t("login_failed"));
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  return (
    <XStack
      flex={1}
      width="100%"
      height="100vh"
      overflow="hidden"
      flexDirection={media.sm ? "column" : "row"}
    >
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$6"
        backgroundColor="white"
      >
        <YStack width="100%" maxWidth={400} space="$4">
          <Text fontSize="$8" fontWeight="bold" textAlign="center">
            {t("signin")}
          </Text>
          <Form
            onSubmit={() =>
              handleSubmit(new Event("submit") as unknown as React.FormEvent)
            }
          >
            <YStack space="$4">
              <Input
                placeholder={t("enter_username")}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                borderBottomWidth={1}
                borderColor="#ccc"
                borderRadius={0}
                disabled={loading}
              />
              <Input
                placeholder={t("enter_password")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                borderBottomWidth={1}
                borderColor="#ccc"
                borderRadius={0}
                disabled={loading}
              />
              {!!error && (
                <Text color="$red10" fontSize="$2">
                  {error}
                </Text>
              )}
              <Form.Trigger asChild>
                <Button
                  icon={loading ? <Spinner color="white" /> : undefined}
                  disabled={loading}
                  backgroundColor="#00b294"
                  hoverStyle={{ backgroundColor: "#00927e" }}
                  borderRadius={999}
                  paddingVertical="$3"
                  marginTop="$2"
                >
                  <Text color="white" fontWeight="bold">
                    {loading ? t("signing_in") : t("login")}
                  </Text>
                </Button>
              </Form.Trigger>
            </YStack>
          </Form>
        </YStack>
      </YStack>
    </XStack>
  );
};
