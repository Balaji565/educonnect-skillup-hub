
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MaterialsList = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    publicUrl?: string;
  }>>([]);

  // Mock data for materials that would normally come from a database
  const availableMaterials = [
    { id: "1", title: "Introduction to Biology", type: "PDF", accessCode: "BIO101", description: "Basic principles of biology" },
    { id: "2", title: "Mathematics Formula Sheet", type: "PDF", accessCode: "MATH202", description: "Essential formulas for calculus" },
    { id: "3", title: "Chemistry Lab Instructions", type: "DOCX", accessCode: "CHEM99", description: "Step-by-step guide for experiments" }
  ];

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode) {
      toast({
        title: "Missing access code",
        description: "Please enter an access code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // First, check our mock data (for demo purposes)
    const mockMaterial = availableMaterials.find(
      material => material.accessCode === accessCode
    );

    // In a real app, we would query Supabase Storage using the access code
    try {
      // Example of how we would search for files with the access code prefix
      const { data: files, error } = await supabase.storage
        .from('materials')
        .list(accessCode, {
          limit: 100,
          offset: 0,
        });

      if (error) {
        throw error;
      }

      // If we found files, add them to our materials list
      if (files && files.length > 0) {
        const newMaterial = {
          id: Date.now().toString(),
          title: files[0].name.split('.')[0].replace(/-/g, ' '),
          type: files[0].name.split('.').pop()?.toUpperCase() || "FILE",
          description: "File uploaded to Supabase storage",
          publicUrl: supabase.storage
            .from('materials')
            .getPublicUrl(`${accessCode}/${files[0].name}`).data.publicUrl
        };

        if (!materials.some(m => m.title === newMaterial.title)) {
          setMaterials([...materials, newMaterial]);
          toast({
            title: "Success!",
            description: `You now have access to "${newMaterial.title}"`,
          });
        } else {
          toast({
            title: "Already accessed",
            description: "You already have access to this material",
          });
        }
      } 
      // If no files found in storage, try our mock data
      else if (mockMaterial) {
        if (!materials.some(m => m.id === mockMaterial.id)) {
          setMaterials([...materials, mockMaterial]);
          toast({
            title: "Success!",
            description: `You now have access to "${mockMaterial.title}"`,
          });
        } else {
          toast({
            title: "Already accessed",
            description: "You already have access to this material",
          });
        }
      } else {
        toast({
          title: "Invalid code",
          description: "The access code you entered is not valid",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error accessing material:", error);
      toast({
        title: "Error",
        description: "There was an error retrieving the material",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setAccessCode("");
    }
  };

  const handleDownload = (material: any) => {
    if (material.publicUrl) {
      // For files in Supabase Storage
      window.open(material.publicUrl, '_blank');
    } else {
      // Mock download for demo entries
      toast({
        title: "Download started",
        description: `Downloading ${material.title}...`,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleAccessSubmit} className="mb-8 space-y-4">
        <div>
          <Label htmlFor="accessCode">Enter Access Code</Label>
          <div className="flex gap-2">
            <Input
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g., BIO101"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Checking..." : "Access"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">Enter the code provided by your teacher to access study materials.</p>
        </div>
      </form>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Materials</h3>
        {materials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {materials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <h4 className="font-medium text-lg">{material.title}</h4>
                <p className="text-gray-600 mt-1">{material.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {material.type}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(material)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No materials accessed yet. Enter an access code to view materials.</p>
            <p className="text-sm text-gray-400 mt-1">Try using code: BIO101</p>
          </div>
        )}
      </div>
    </div>
  );
};
