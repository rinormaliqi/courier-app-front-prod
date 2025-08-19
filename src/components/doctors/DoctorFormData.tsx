"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Doctor, DoctorFormData } from '@/src/types/doctor';
import { ArrowDownIcon, PlusIcon } from '@/src/icons/index';
import { Button, Dialog, Fieldset, Input, Label, TextArea, XStack, YStack, Switch, H4, Spinner } from 'tamagui';
import { useLanguage } from '@/src/contexts/LanguageContext';

interface DoctorFormModalProps {
  doctor?: Doctor | null;
  onClose: () => void;
  onSubmit: (form: DoctorFormData) => Promise<void>;
}

const initialFormData: DoctorFormData = {
  firstName: "",
  lastName: "",
  address: "",
  locationDTO: {
    latitude: 0,
    longitude: 0,
    formattedAddress: "",
    city: "",
    postalCode: "",
  },
  deletedAt: null,
  deletedBy: null
};


export const DoctorFormModal = ({ doctor, onClose, onSubmit }: DoctorFormModalProps) => {
  const [form, setForm] = React.useState<DoctorFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [useMap, setUseMap] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const { t } = useLanguage();
  
  // Refs for map elements
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  React.useEffect(() => {
    if (doctor) {
      // Only keep necessary location fields
      const { locationDTO, ...editableFields } = doctor;
      setForm({
        ...editableFields,
        locationDTO: {
          id: locationDTO.id,
          latitude: locationDTO.latitude,
          longitude: locationDTO.longitude,
          formattedAddress: locationDTO.formattedAddress,
          city: locationDTO.city,
          postalCode: locationDTO.postalCode
        }
      });
      
      if (doctor.locationDTO.latitude !== 0 && doctor.locationDTO.longitude !== 0) {
        setUseMap(true);
      }
    } else {
      setForm(initialFormData);
    }
  }, [doctor]);

  // Initialize map when useMap is true
  useEffect(() => {
    if (!useMap) return;
    setIsMapLoading(true);

    const loadGoogleMapsScript = () => {
      if (typeof window.google === "object" && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBzXLdJC2c7-ImJ3q6-TMWpJIaZwEAJmwQ&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current || !inputRef.current) {
        setIsMapLoading(false);
        return;
      }

      // Use doctor's location if available, otherwise default to Kosovo
      const initialLocation = doctor?.locationDTO.latitude && doctor?.locationDTO.longitude
        ? { lat: doctor.locationDTO.latitude, lng: doctor.locationDTO.longitude }
        : { lat: 42.6629, lng: 21.1655 }; // Kosovo coordinates

      const map = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 13,
      });
      
      mapInstance.current = map;

      // Create marker if location exists
      if (doctor?.locationDTO.latitude && doctor?.locationDTO.longitude) {
        const marker = new window.google.maps.Marker({
          map,
          position: initialLocation,
          draggable: true
        });
        markerInstance.current = marker;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.bindTo("bounds", map);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        map.setCenter(place.geometry.location);
        
        // Update or create marker
        if (markerInstance.current) {
          markerInstance.current.setPosition(place.geometry.location);
        } else {
          const marker = new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            draggable: true
          });
          markerInstance.current = marker;
        }

        // Extract address components
        let city = '';
        let postalCode = '';
        
        place.address_components?.forEach(component => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        // Update form with location data
        handleLocationUpdate(
          place.geometry?.location?.lat() ?? 0,
          place.geometry.location?.lng() ?? 0,
          place.formatted_address || "",
          city,
          postalCode
        );
      });

      map.addListener("click", (e:google.maps.MapMouseEvent
      ) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (!lat || !lng) return;

        if (markerInstance.current) {
          markerInstance.current.setPosition(e.latLng);
        } else {
          const marker = new window.google.maps.Marker({
            map,
            position: e.latLng,
            draggable: true
          });
          markerInstance.current = marker;
        }

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            // Extract address components
            let city = '';
            let postalCode = '';
            
            results[0].address_components?.forEach(component => {
              if (component.types.includes('locality')) {
                city = component.long_name;
              }
              if (component.types.includes('postal_code')) {
                postalCode = component.long_name;
              }
            });

            handleLocationUpdate(
              lat, 
              lng, 
              results[0].formatted_address,
              city,
              postalCode
            );
          }
        });
      });

      // Handle marker drag events
      if (markerInstance.current) {
        markerInstance.current.addListener("dragend", (e:google.maps.MapMouseEvent
        ) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (!lat || !lng) return;

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              // Extract address components
              let city = '';
              let postalCode = '';
              
              results[0].address_components?.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
              });

              handleLocationUpdate(
                lat, 
                lng, 
                results[0].formatted_address,
                city,
                postalCode
              );
            }
          });
        });
      }
      
      setIsMapLoading(false);
    };

    loadGoogleMapsScript();

    return () => {
      // Clean up map instances
      if (markerInstance.current) markerInstance.current.setMap(null);
      if (mapInstance.current) mapInstance.current = null;
    };
  }, [useMap]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare payload with only necessary fields
      const payload = {
        ...form,
        locationDTO: {
          id: form.locationDTO.id || undefined, // Send undefined for new locations
          latitude: form.locationDTO.latitude,
          longitude: form.locationDTO.longitude,
          formattedAddress: form.locationDTO.formattedAddress,
          city: form.locationDTO.city,
          postalCode: form.locationDTO.postalCode,
        }
      };
  
      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: keyof DoctorFormData, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (name: keyof DoctorFormData['locationDTO'], value: string | number) => {
    setForm(prev => ({
      ...prev,
      locationDTO: {
        ...prev.locationDTO,
        [name]: value
      }
    }));
  };
  
  const handleLocationUpdate = (
    lat: number, 
    lng: number, 
    formattedAddress: string,
    city: string,
    postalCode: string
  ) => {
    setForm(prev => ({
      ...prev,
      locationDTO: {
        ...prev.locationDTO,
        latitude: lat,
        longitude: lng,
        formattedAddress,
        city,
        postalCode
      }
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay 
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          w="90%"
          maxWidth={900}
          maxHeight="90vh"
          overflow="auto"
        >
          <Dialog.Title>{doctor ? t("doctor.form.edit_title") : t("doctor.form.create_title")}</Dialog.Title>
          
          <XStack space="$4" flexWrap="wrap">
            <YStack space="$3" flex={1} minWidth={300}>
              <Fieldset>
                <Label htmlFor={t("doctor.form.first_name")}>{t("doctor.form.first_name")}</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChangeText={(text: string) => handleChange('firstName', text)}
                  placeholder="First Name"
                />
              </Fieldset>
              
              <Fieldset>
                <Label htmlFor={t("doctor.form.last_name")}>{t("doctor.form.last_name")}</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChangeText={(text:string) => handleChange('lastName', text)}
                  placeholder="Last Name"
                />
              </Fieldset>
              
              <Fieldset>
                <Label htmlFor={t("doctor.form.address")}>{t("doctor.form.address")}</Label>
                <TextArea
                  id="address"
                  value={form.address}
                  onChangeText={(text:string) => handleChange('address', text)}
                  placeholder="Full Address"
                  numberOfLines={3}
                />
              </Fieldset>
              
              <Fieldset>
                <XStack alignItems="center" space="$4">
                  <Label htmlFor="use-map" width={120}>
                    {t("doctor.form.use_map")}
                  </Label>
                  <Switch 
                    id="use-map" 
                    checked={useMap} 
                    onCheckedChange={setUseMap}
                    size="$2"
                  >
                    <Switch.Thumb animation="quick" />
                  </Switch>
                </XStack>
              </Fieldset>
              
              <YStack borderTopWidth={1} borderTopColor="$borderColor" pt="$3">
                <Label>{t("doctor.form.location_details")}</Label>
                
                <XStack space="$2">
                  <Fieldset flex={1}>
                    <Label htmlFor={t("doctor.form.latitude")}>{t("doctor.form.latitude")}</Label>
                    <Input
                      id="latitude"
                      value={form.locationDTO.latitude.toString()}
                      onChangeText={(text: string) => handleLocationChange('latitude', Number(text) || 0)}
                      placeholder="Latitude"
                      keyboardType="numeric"
                    />
                  </Fieldset>
                  
                  <Fieldset flex={1}>
                    <Label htmlFor={t("doctor.form.longitude")}>{t("doctor.form.longitude")}</Label>
                    <Input
                      id="longitude"
                      value={form.locationDTO.longitude.toString()}
                      onChangeText={(text:string) => handleLocationChange('longitude', Number(text) || 0)}
                      placeholder="Longitude"
                      keyboardType="numeric"
                    />
                  </Fieldset>
                </XStack>
                
                <Fieldset>
                  <Label htmlFor={t("doctor.form.formatted_address")}>{t("doctor.form.formatted_address")}</Label>
                  <Input
                    id="formattedAddress"
                    value={form.locationDTO.formattedAddress}
                    onChangeText={(text:string) => handleLocationChange('formattedAddress', text)}
                    placeholder="Formatted Address"
                  />
                </Fieldset>
                
                <XStack space="$2">
                  <Fieldset flex={1}>
                    <Label htmlFor={t("doctor.form.city")}>{t("doctor.form.city")}</Label>
                    <Input
                      id="city"
                      value={form.locationDTO.city}
                      onChangeText={(text:string) => handleLocationChange('city', text)}
                      placeholder="City"
                    />
                  </Fieldset>
                  
                  <Fieldset flex={1}>
                    <Label htmlFor={t("doctor.form.postal_code")}>{t("doctor.form.postal_code")}</Label>
                    <Input
                      id="postalCode"
                      value={form.locationDTO.postalCode}
                      onChangeText={(text:string) => handleLocationChange('postalCode', text)}
                      placeholder="Postal Code"
                    />
                  </Fieldset>
                </XStack>
              </YStack>
            </YStack>
            
            {/* Conditionally render map section */}
            {useMap && (
              <YStack space="$3" flex={1} minWidth={300}>
                <H4>{t("doctor.form.select_location")}</H4>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t("doctor.form.search_location")}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
                {isMapLoading ? (
                  <YStack flex={1} justifyContent="center" alignItems="center" height={400}>
                    <Spinner size="large" />
                  </YStack>
                ) : (
                  <div 
                    ref={mapRef} 
                    style={{ 
                      width: '100%', 
                      height: '400px', 
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }} 
                  />
                )}
              </YStack>
            )}
          </XStack>

          <XStack alignSelf="flex-end" space="$2" mt="$4">
            <Dialog.Close asChild>
              <Button>{t("cancel")}</Button>
            </Dialog.Close>
            <Button
              icon={PlusIcon}
              theme="active"
              onPress={handleSubmit}
              loading={isSubmitting}
            >
              {doctor ? t(`common.update`) : t("common.create")}
            </Button>
          </XStack>
          
          <Dialog.Close asChild>
            <Button
              position="absolute"
              top="$2"
              right="$2"
              size="$2"
              circular
              icon={ArrowDownIcon}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
