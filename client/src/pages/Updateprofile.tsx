import React, { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Inputbox from "../components/Inputbox";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UpdateUserProfile: React.FC = () => {
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<{ github?: string; linkedin?: string }>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [collegeName, setCollegeName] = useState<string>("");
  const [experience, setExperience] = useState<
    { companyName: string; title: string; description: string }[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/v1/user/user-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data;
        setFirstName(data.firstname || "");
        setLastName(data.lastname || "");
        setBio(data.bio || "");
        setSocialLinks(data.socialLinks || {});
        setSkills(data.techStacks || []);
        setCollegeName(data.collegeName || "");
        setExperience(data.experience || []);
      } catch (error) {
        console.error("Error fetching profile data", error);
        setErrors(["Failed to fetch profile data. Please try again later."]);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Validate form inputs
  const validateInputs = () => {
    const validationErrors: string[] = [];
    if (!firstname.trim()) validationErrors.push("First name is required.");
    if (!lastname.trim()) validationErrors.push("Last name is required.");
    if (!collegeName.trim()) validationErrors.push("College name is required.");
    if (bio.length > 300) validationErrors.push("Bio must be 300 characters or fewer.");
    if (socialLinks.github && !/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+$/.test(socialLinks.github)) {
      validationErrors.push("GitHub link must be a valid URL.");
    }
    if (socialLinks.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+$/.test(socialLinks.linkedin)) {
      validationErrors.push("LinkedIn link must be a valid URL.");
    }
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3000/api/v1/user/user-profile",
        {
          firstname,
          lastname,
          bio,
          socialLinks,
          skills,
          collegeName,
          experience: experience.filter(i => i.companyName && i.title && i.description),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully:", response.data);
        navigate("/feed"); // Redirect after successful update
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors(["Failed to update profile. Please try again."]);
    }
  };

  // Add a new experience field
  const handleAddExperience = () => {
    setExperience([...experience, { companyName: "", title: "", description: "" }]);
  };

  // Handle input changes for dynamic fields (e.g., experience)
  const handleInputChange = (
    index: number,
    field: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setter(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <Navbar />
      <div className="flex flex-col justify-center p-6">
        <div className="rounded-lg bg-white w-96 max-w-2xl text-center p-4 overflow-y-auto">
          <Heading label="Update User Profile" />
          <SubHeading label="Update your details below" />
          {errors.length > 0 && (
            <ul className="text-red-500 text-sm mb-2 list-disc list-inside">
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          )}
          <Inputbox
            label="First Name"
            placeholder="Enter first name"
            value={firstname}
            onChange={e => setFirstName(e.target.value)}
          />
          <Inputbox
            label="Last Name"
            placeholder="Enter last name"
            value={lastname}
            onChange={e => setLastName(e.target.value)}
          />
          <Inputbox
            label="Bio"
            placeholder="Enter bio (max 300 characters)"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          <Inputbox
            label="GitHub Profile"
            placeholder="Enter GitHub URL"
            value={socialLinks.github || ""}
            onChange={e => setSocialLinks({ ...socialLinks, github: e.target.value })}
          />
          <Inputbox
            label="LinkedIn Profile"
            placeholder="Enter LinkedIn URL"
            value={socialLinks.linkedin || ""}
            onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
          />
          <Inputbox
            label="Skills (comma-separated)"
            placeholder="Enter Skills"
            value={skills.join(",")}
            onChange={e => setSkills(e.target.value.split(","))}
          />
          <Inputbox
            label="College Name"
            placeholder="Enter college name"
            value={collegeName}
            onChange={e => setCollegeName(e.target.value)}
          />

          <div className="pt-4">
            <div className="mb-6 px-4">
              <Heading label="Experience" />
            </div>
            {experience.map((exp, index) => (
              <div key={index}>
                <Inputbox
                  label="Company Name"
                  placeholder="Enter company name"
                  value={exp.companyName}
                  onChange={e => handleInputChange(index, "companyName", e.target.value, setExperience)}
                />
                <Inputbox
                  label="Role"
                  placeholder="Enter role"
                  value={exp.title}
                  onChange={e => handleInputChange(index, "title", e.target.value, setExperience)}
                />
                <Inputbox
                  label="Description"
                  placeholder="Enter description"
                  value={exp.description}
                  onChange={e => handleInputChange(index, "description", e.target.value, setExperience)}
                />
              </div>
            ))}
            <Button label="Add Experience" onClick={handleAddExperience} />
          </div>

          <div className="pt-4">
            <Button label="Update Profile" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;