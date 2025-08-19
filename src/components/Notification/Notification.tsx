// src/components/common/Notification.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { View, Text, AnimatePresence, styled, YStack, useTheme } from "tamagui";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const theme = useTheme();

  const showNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    [],
  );

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return theme.green5;
      case "error":
        return theme.red5;
      case "warning":
        return theme.yellow5;
      default:
        return theme.blue5;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notifications.length > 0 && (
          <YStack
            position="fixed"
            top="$4"
            right="$4"
            zIndex={1000}
            space="$2"
            alignItems="flex-end"
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                backgroundColor={getBgColor(notification.type)}
                animation="bouncy"
                enterStyle={{ x: 300, opacity: 0 }}
                exitStyle={{ x: 300, opacity: 0 }}
                x={0}
                opacity={1}
              >
                <Text color="white" fontWeight="bold">
                  {notification.message}
                </Text>
              </NotificationItem>
            ))}
          </YStack>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

const NotificationItem = styled(View, {
  padding: "$3",
  borderRadius: "$2",
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
