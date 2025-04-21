
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, title: string, type: string, accessCode: string}>>([
    { id: "1", title: "Introduction to Biology", type: "PDF", accessCode: "BIO101" },
    { id: "2", title: "Mathematics Formula Sheet", type: "PDF", accessCode: "MATH202" }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateAccessCode = () => {
    // Generate a random 6-character code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      toast({
        title: "Missing information",
        description: "Please provide a file and title",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Generate access code
      const newCode = generateAccessCode();
      
      // Create a unique file path with the access code
      const fileExt = file.name.split('.').pop();
      const fileName = `${newCode}/${title.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from('materials')
        .getPublicUrl(fileName);
      
      // Store file metadata
      const fileData = {
        id: Date.now().toString(),
        title,
        type: fileExt?.toUpperCase() || "FILE",
        accessCode: newCode,
        description: description || "",
        filePath: fileName,
        publicUrl: urlData?.publicUrl || ""
      };
      
      // In a production app, we would save this to a database table
      // Here we're just updating the state
      setUploadedFiles([...uploadedFiles, fileData]);
      setAccessCode(newCode);
      setIsOpen(true);
      
      toast({
        title: "File uploaded successfully",
        description: "Your material is now available with the access code",
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <div>
          <Label htmlFor="title">Material Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 5 - Cell Division"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description about this material"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="file">Upload File (PDF, DOCX, JPG, etc.)</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Material"}
        </Button>
      </form>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Material Uploaded Successfully!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Your material has been uploaded successfully. Share this access code with your students:</p>
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <span className="text-2xl font-mono font-bold">{accessCode}</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Students will need this code to access the material.</p>
          </div>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Uploaded Materials</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Access Code</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 px-2 py-1 rounded">{item.accessCode}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
