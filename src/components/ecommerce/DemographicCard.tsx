"use client";

import React, { useState, useEffect, useRef } from "react";
import { View, Text, YStack, XStack, Card, ScrollView } from "tamagui";
import SVG from "react-inlinesvg";
import styles from "./KosovoMap.module.css";

type RegionData = {
  id: string;
  name: string;
  couriers: number;
  pending: number;
  delayed: number;
};

const mockData: RegionData[] = [
  { id: "path2550", name: "Prishtina", couriers: 122, pending: 18, delayed: 7 },
  { id: "path3188", name: "Peja", couriers: 84, pending: 11, delayed: 2 },
  { id: "path3190", name: "Gjakova", couriers: 47, pending: 5, delayed: 0 },
  { id: "path3265", name: "Ferizaj", couriers: 60, pending: 9, delayed: 3 },
  { id: "path3267", name: "Mitrovica", couriers: 35, pending: 6, delayed: 1 },
  { id: "path3269", name: "Gjilan", couriers: 52, pending: 7, delayed: 4 },
];

export default function KosovoDemographicCard() {
  const [hovered, setHovered] = useState<RegionData | null>(null);
  const [selected, setSelected] = useState<RegionData | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSvgEvent = (e: MouseEvent) => {
      const path = e.target as SVGPathElement;
      if (!path.id || !path.matches("path")) return;

      const region = mockData.find((r) => r.id === path.id);
      if (!region) return;

      switch (e.type) {
        case "mouseenter":
          setHovered(region);
          break;
        case "click":
          setSelected(region);
          break;
      }
    };

    const handleSvgMouseLeave = () => setHovered(null);

    const svgContainer = svgRef.current;
    if (!svgContainer) return;

    svgContainer.addEventListener("mouseenter", handleSvgEvent, true);
    svgContainer.addEventListener("click", handleSvgEvent, true);
    svgContainer.addEventListener("mouseleave", handleSvgMouseLeave);

    return () => {
      svgContainer.removeEventListener("mouseenter", handleSvgEvent, true);
      svgContainer.removeEventListener("click", handleSvgEvent, true);
      svgContainer.removeEventListener("mouseleave", handleSvgMouseLeave);
    };
  }, []);
  // const getPathClass = (id: string) => {
  //   if (selected?.id === id) return styles.selected
  //   if (hovered?.id === id) return styles.hovered
  //   return styles.default
  // }

  return (
    <XStack
      space="$4"
      alignItems="flex-start"
      justifyContent="center"
      flexWrap="wrap"
      width="100%"
      padding="$4"
    >
      {/* Stats Section */}
      <Card
        flex={1}
        minWidth={320}
        maxWidth={400}
        padded
        bordered
        backgroundColor="$background"
      >
        <YStack flex={1}>
          <Text fontSize="$6" fontWeight="700" marginBottom="$3">
            Regional Statistics
          </Text>

          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderBottomWidth="$0.5"
            borderBottomColor="$borderColor"
            marginBottom="$1"
          >
            <Text flex={1} fontWeight="700" fontSize="$3" color="$gray11">
              Region
            </Text>
            <XStack width={180} justifyContent="space-between">
              <Text fontWeight="700" fontSize="$3" color="$gray11">
                Couriers
              </Text>
              <Text fontWeight="700" fontSize="$3" color="$gray11">
                Pending
              </Text>
              <Text fontWeight="700" fontSize="$3" color="$gray11">
                Delayed
              </Text>
            </XStack>
          </XStack>

          <ScrollView maxHeight={400}>
            {mockData.map((r) => (
              <XStack
                key={r.id}
                justifyContent="space-between"
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
                onPress={() => setSelected(r)}
                padding="$3"
                borderRadius="$3"
                backgroundColor={
                  selected?.id === r.id
                    ? "$green3"
                    : hovered?.id === r.id
                      ? "$blue3"
                      : "transparent"
                }
                hoverStyle={{ backgroundColor: "$blue2" }}
                transition="background 0.2s"
                alignItems="center"
              >
                <Text flex={1} fontWeight="600">
                  {r.name}
                </Text>
                <XStack width={180} justifyContent="space-between">
                  <Text fontWeight="500">{r.couriers}</Text>
                  <Text fontWeight="500" color="$orange10">
                    {r.pending}
                  </Text>
                  <Text
                    fontWeight="500"
                    color={r.delayed > 0 ? "$red10" : "$green10"}
                  >
                    {r.delayed}
                  </Text>
                </XStack>
              </XStack>
            ))}
          </ScrollView>

          <Card marginTop="$4" backgroundColor="$blue1" borderColor="$blue5">
            <XStack padding="$3" alignItems="center" space="$3">
              <View
                width={12}
                height={12}
                borderRadius={6}
                backgroundColor="$blue9"
              />
              <YStack flex={1}>
                <Text fontWeight="600">Activity Summary</Text>
                <Text fontSize="$2" color="$gray10">
                  Hover over regions to highlight areas with pending/delayed
                  orders
                </Text>
              </YStack>
            </XStack>
          </Card>
        </YStack>
      </Card>

      {/* Map Section */}
      <Card
        flex={1}
        minWidth={400}
        maxWidth={600}
        padded
        bordered
        backgroundColor="$blue1"
      >
        <View position="relative" width="100%" height={400} ref={svgRef}>
          <View className={styles.svgContainer}>
            <SVG
              src="/Kosovo_Map.svg"
              className={styles.svgElement}
              preProcessor={(svg) =>
                svg.replace(/<\?xml.*?\?>/, "").replace(/<style.*<\/style>/, "")
              }
              loader={<Text>Loading map...</Text>}
            />
          </View>

          {(selected || hovered) && (
            <Card
              position="absolute"
              top="$3"
              left="$3"
              padding="$3"
              backgroundColor="$background"
              borderColor="$borderColor"
              elevation="$2"
              animateOnly={["transform", "opacity"]}
              animation="quick"
              enterStyle={{ opacity: 0, y: -10 }}
              opacity={1}
              y={0}
            >
              <Text fontWeight="700" fontSize="$5" color="$color">
                {(selected || hovered)?.name}
              </Text>
              <XStack alignItems="center" marginTop="$1">
                <Text fontSize="$3" color="$gray10" width={140}>
                  Couriers:
                </Text>
                <Text fontWeight="600">{(selected || hovered)?.couriers}</Text>
              </XStack>
              <XStack alignItems="center">
                <Text fontSize="$3" color="$gray10" width={140}>
                  Pending Orders:
                </Text>
                <Text fontWeight="600" color="$orange10">
                  {(selected || hovered)?.pending}
                </Text>
              </XStack>
              <XStack alignItems="center">
                <Text fontSize="$3" color="$gray10" width={140}>
                  Delayed:
                </Text>
                <Text fontWeight="600" color="$red10">
                  {(selected || hovered)?.delayed}
                </Text>
              </XStack>
            </Card>
          )}
        </View>

        {/* Legend */}
        <XStack justifyContent="space-between" marginTop="$2">
          <XStack alignItems="center" space="$2">
            <View
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="#60a5fa"
            />
            <Text fontSize="$2">Normal</Text>
          </XStack>
          <XStack alignItems="center" space="$2">
            <View
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="$blue9"
            />
            <Text fontSize="$2">Hovered</Text>
          </XStack>
          <XStack alignItems="center" space="$2">
            <View
              width={12}
              height={12}
              borderRadius={6}
              backgroundColor="$green9"
            />
            <Text fontSize="$2">Selected</Text>
          </XStack>
        </XStack>
      </Card>
    </XStack>
  );
}
