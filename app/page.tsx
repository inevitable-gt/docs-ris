import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Book, Terminal, Cpu, HardDrive, Files, Settings, AlertCircle, Search, Sun, Moon, Code, FileCode, AlertTriangle } from 'lucide-react';

const DocsLayout = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const examples = {
    bootloader: `VAR BOOT_MSG >> Initializing RIS OS...
PRN $BOOT_MSG
MEM SIZE
PROC CREATE init
SYS DIR
INT 0
HLT`,
    shell: `VAR PROMPT >> RIS>
:loop
PRN $PROMPT
VAR cmd <<
PROC CREATE shell
SYS DIR
INT 0
GOTO loop
HLT`,
    memoryManager: `MEM WRITE 0 255
MEM WRITE 1 128
MEM READ 0
MEM READ 1
INT 1
HLT`,
    processManager: `PROC CREATE main
PROC CREATE worker1
PROC CREATE worker2
PROC LIST
PROC KILL 2
PROC LIST
HLT`
  };

  const sections = {
    overview: {
      title: 'Overview',
      icon: Book,
      content: (
        <div className="space-y-4">
          <p>RIS is an extended assembly-like language designed for OS development with support for memory management, process control, file operations, and system interrupts.</p>
          
          <h3 className="text-xl font-semibold mt-6">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Memory management with 1MB default space</li>
            <li>Process creation and control</li>
            <li>File system operations</li>
            <li>System interrupts</li>
            <li>Error handling</li>
          </ul>
        </div>
      )
    },
    basic: {
      title: 'Basic Instructions',
      icon: Terminal,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">PRN - Print output</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            PRN message     ; Print direct message{'\n'}
            PRN $variable   ; Print variable content
          </pre>

          <h3 className="text-xl font-semibold mt-6">VAR - Variable operations</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            VAR name >> value   ; Set variable{'\n'}
            VAR name <<         ; Get input from user
          </pre>

          <h3 className="text-xl font-semibold mt-6">HLT - Stop execution</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            HLT               ; End program
          </pre>
        </div>
      )
    },
    memory: {
      title: 'Memory Management',
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">MEM - Memory operations</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            MEM READ address    ; Read from memory address{'\n'}
            MEM WRITE address value  ; Write to memory address{'\n'}
            MEM SIZE            ; Display memory size
          </pre>
        </div>
      )
    },
    examples: {
      title: 'Examples',
      icon: FileCode,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Simple Bootloader</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {examples.bootloader}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Basic Shell</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {examples.shell}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Memory Manager</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {examples.memoryManager}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Process Manager</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {examples.processManager}
            </pre>
          </div>
        </div>
      )
    },
    errorHandling: {
      title: 'Error Handling',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p>The RIS interpreter includes comprehensive error checking for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Invalid memory access attempts</li>
            <li>Process management errors</li>
            <li>File operation failures</li>
            <li>System command errors</li>
            <li>Invalid interrupt numbers</li>
          </ul>
        </div>
      )
    },
    setup: {
      title: 'Setup Guide',
      icon: Code,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Visual Studio 2022</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Create new C++ project</li>
            <li>Set C++17 or later</li>
            <li>Include required headers</li>
            <li>Build solution</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6">VSCode</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Install C/C++ extension</li>
            <li>Configure c_cpp_properties.json for C++17</li>
            <li>Set up build tasks</li>
            <li>Configure debugging</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6">Compilation</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            g++ -std=c++17 ris.cpp -o ris
          </pre>

          <h3 className="text-xl font-semibold mt-6">Running</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            ./ris program.ris
          </pre>
        </div>
      )
    }
  };

  const filteredSections = useMemo(() => {
    return Object.entries(sections).filter(([key, section]) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(section.content).toLowerCase().includes(searchQuery.toLowerCase())
    ).map(([key]) => key);
  }, [searchQuery]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4`}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-bold">RIS Docs</div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-200 focus:border-blue-500'
            } border focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="space-y-1">
          {Object.entries(sections)
            .filter(([key]) => filteredSections.includes(key))
            .map(([key, section]) => {
              const Icon = section.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                    activeSection === key
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : `text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700`
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {section.title}
                  <ChevronRight className={`ml-auto w-4 h-4 ${
                    activeSection === key 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-400'
                  }`} />
                </button>
              );
            })}
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className="max-w-4xl">
          <div className="flex items-center mb-6">
            {sections[activeSection].icon && 
              <sections[activeSection].icon className="w-6 h-6 mr-3" />
            }
            <h2 className="text-2xl font-bold">{sections[activeSection].title}</h2>
          </div>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
};

export default DocsLayout;
