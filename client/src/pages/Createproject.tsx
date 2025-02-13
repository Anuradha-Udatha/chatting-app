import React, { useState, useRef } from 'react';
import Heading from '../components/Heading';
import Inputbox from '../components/Inputbox';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Createproject: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCreateProject = async () => {
    try {
      setError(null); 
      setSuccess(null); 

      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }

      // Construct payload
      const payload = {
        title,
        description,
        projectTechStack: projectTechStack.split(',').map((tech) => tech.trim()), 
        skillsNeeded: skillsNeeded.split(',').map((skill) => skill.trim()), 
        status,
      };

      const response = await axios.post('http://localhost:3000/api/v1/projects', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Project created successfully!');
      console.log('Response:', response.data);
      setTitle('');
      setDescription('');
      setProjectTechStack('');
      setSkillsNeeded('');
      setStatus('');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project. Please try again.');
    }
  };

  return (
    <div className="flex bg-slate-300 justify-center min-h-screen">
      <Navbar />
      <div className="flex bg-slate-300 w-full ml-16 mr-8 md:ml-72">
        <div className="flex flex-col w-full max-w-xl mx-auto">
          <Heading label="Create Project" />
          
          <div
            ref={cardRef}
            className="bg-white rounded-lg p-6 my-4 shadow-md flex flex-col justify-between h-[65vh]"
          >
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          
          <Inputbox
            label="Title"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <Inputbox
            label="Description"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <Inputbox
            label="Tech Stacks"
            placeholder="Enter Project Tech stack (comma-separated)"
            value={projectTechStack}
            onChange={(e) => setProjectTechStack(e.target.value)}
          />

          <Inputbox
            label="Skills Required for the Project"
            placeholder="Enter Skillset (comma-separated)"
            value={projectTechStack}
            onChange={(e) => setProjectTechStack(e.target.value)}
          />
          
          <Inputbox
            label="Status"
            placeholder="Enter status (open, in-progress, completed)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          
          <div className="pt-4">
            <Button label="Create Project" onClick={handleCreateProject} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Createproject;