"use client";
import { useAuth } from "@/src/contexts/authContext";
import {
  Button,
  Card,
  H2,
  H3,
  Paragraph,
  Separator,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { useMedia } from "tamagui";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const media = useMedia();

  if (loading) {
    return (
      <XStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$green10" />
      </XStack>
    );
  }

  if (!user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <H2>{t("authNotAuthenticated")}</H2>
        <Button
          onPress={() => router.push("/login")}
          backgroundColor="#00b294"
          marginTop="$4"
        >
          {t("authGoToLogin")}
        </Button>
      </YStack>
    );
  }

  return (
    <XStack
      flex={1}
      backgroundColor="$gray2"
      padding={media.sm ? "$4" : "$8"}
      justifyContent="center"
    >
      <YStack width="100%" maxWidth={800} space="$4">
        <H2 color="$gray12">{t("userProfileTitle")}</H2>

        <Card
          elevate
          bordered
          width="100%"
          padding="$6"
          borderRadius="$4"
          backgroundColor="white"
        >
          <Card.Header>
            <YStack space="$4">
              <XStack alignItems="center" space="$4">
                <YStack
                  width={60}
                  height={60}
                  borderRadius={30}
                  backgroundColor="$green5"
                  justifyContent="center"
                  alignItems="center"
                >
                  <H3 color="white">{user.name.charAt(0)}</H3>
                </YStack>
                <YStack>
                  <H3 color="$gray12">{user.name}</H3>
                  <Paragraph color="$gray10">{user.email}</Paragraph>
                </YStack>
              </XStack>

              <Separator />

              <YStack space="$2">
                <H3 color="$gray12">{t("userAccountDetails")}</H3>

                <XStack space="$4">
                  <YStack width="30%">
                    <Paragraph fontWeight="bold" color="$gray11">
                      {t("userIdLabel")}
                    </Paragraph>
                  </YStack>
                  <YStack width="70%">
                    <Paragraph color="$gray12">{user.id}</Paragraph>
                  </YStack>
                </XStack>

                <XStack space="$4">
                  <YStack width="30%">
                    <Paragraph fontWeight="bold" color="$gray11">
                      {t("email")}
                    </Paragraph>
                  </YStack>
                  <YStack width="70%">
                    <Paragraph color="$gray12">{user.email}</Paragraph>
                  </YStack>
                </XStack>

                <XStack space="$4">
                  <YStack width="30%">
                    <Paragraph fontWeight="bold" color="$gray11">
                      {t("userRolesLabel")}
                    </Paragraph>
                  </YStack>
                  <YStack width="70%">
                    <XStack flexWrap="wrap" gap="$2">
                      {user.roles.map((role, index) => (
                        <Paragraph
                          key={index}
                          backgroundColor="$green3"
                          color="$green10"
                          paddingHorizontal="$3"
                          paddingVertical="$1"
                          borderRadius="$2"
                        >
                          {role}
                        </Paragraph>
                      ))}
                    </XStack>
                  </YStack>
                </XStack>
              </YStack>
            </YStack>
          </Card.Header>

          <Card.Footer marginTop="$6">
            <XStack justifyContent="flex-end" space="$3">
              <Button
                onPress={() => router.push("/dashboard")}
                borderColor="$gray8"
                color="$gray10"
              >
                {t("navigationBackToDashboard")}
              </Button>
              <Button
                onPress={logout}
                backgroundColor="$red9"
                hoverStyle={{ backgroundColor: "$red10" }}
              >
                {t("logout")}
              </Button>
            </XStack>
          </Card.Footer>
        </Card>
      </YStack>
    </XStack>
  );
}
