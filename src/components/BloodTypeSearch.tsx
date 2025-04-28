import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Droplet, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type BloodType = Database["public"]["Enums"]["blood_type"];

const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const locations = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

interface DonorResult {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  blood_type: BloodType;
  location: string;
}

export function BloodTypeSearch() {
  const { toast } = useToast();
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [location, setLocation] = useState("");
  const [donorResults, setDonorResults] = useState<DonorResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
  
    try {
      
      let donorQuery = supabase
        .from('donors') 
        .select('*');
  
      if (bloodType) {
        donorQuery = donorQuery.eq('blood_type', bloodType as BloodType);
      }
  
      const { data: donorData, error: donorError } = await donorQuery;
  
      if (donorError) {
        console.error("Error searching donors:", donorError);
        toast({
          title: "Search Failed",
          description: "There was a problem searching donors. Please try again.",
          variant: "destructive",
        });
        return;
      }
  
      
      const donorResultsFormatted = donorData.map(item => ({
        id: item.id,
        full_name: item.full_name,
        email: item.email,
        phone_number: item.phone_number,
        blood_type: item.blood_type,
        location: item.location, 
      }));
  
      setDonorResults(donorResultsFormatted);
  
    } catch (error) {
      console.error("Exception in donors search:", error);
      toast({
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Find Blood</h2>
            <p className="max-w-[85%] mx-auto text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Search for available blood types from registered donors near you.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Search Blood Availability</CardTitle>
              <CardDescription>
                Enter blood type and location to find donors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={bloodType} onValueChange={(value: BloodType | "") => setBloodType(value)}>
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </CardContent>
          </Card>

          {donorResults.length > 0 && (
            <div className="mt-12 space-y-4">
              <h3 className="text-2xl font-bold">Available Donors</h3>
              {donorResults.map((donor) => (
                <Card key={donor.id} className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold flex items-center">
                          <User className="h-4 w-4 mr-2" /> {donor.full_name}
                        </h4>
                        <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {donor.email} <br />
                          {donor.phone_number} <br />
                          {donor.location}
                        </div>
                      </div>
                      <div className="bg-lifepulse-pink dark:bg-gray-800 px-3 py-2 rounded-full flex items-center">
                        <Droplet className="h-4 w-4 text-lifepulse-red mr-1" />
                        <span className="font-bold">{donor.blood_type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BloodTypeSearch;
