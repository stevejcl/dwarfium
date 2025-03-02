import React, { useState, useEffect, ChangeEvent } from "react";

const simulatedFiles = ["session1.json", "session2.json"];

const simulatedFileContents: { [key: string]: any } = {
    "session1.json": {
        command: {
            id_command: { description: "Session 1", date: "2023-01-01", time: "12:00", process: "Done" },
            eq_solving: { do_action: true, wait_before: 5, wait_after: 10 },
        },
    },
    "session2.json": {
        command: {
            id_command: { description: "Session 2", date: "2023-01-02", time: "14:00", process: "Pending" },
            auto_focus: { do_action: true, wait_before: 3, wait_after: 4 },
        },
    },
};

const OverviewSessionTab: React.FC = () => {
    const [sessionFiles, setSessionFiles] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [fileContent, setFileContent] = useState<string>("");

    useEffect(() => {
        setSessionFiles(simulatedFiles);
    }, []);

    const handleSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedFiles(selectedOptions);

        if (selectedOptions.length > 0) {
            displayJsonContent(selectedOptions[selectedOptions.length - 1]);
        } else {
            setFileContent("");
        }
    };

    const displayJsonContent = (filename: string) => {
        const data = simulatedFileContents[filename];
        if (!data) {
            setFileContent("No content found.");
            return;
        }

        const command = data.command;
        const id_command = command.id_command;
        let content = `Description: ${id_command.description || "N/A"}\nDate: ${id_command.date || "N/A"}\nTime: ${id_command.time || "N/A"}\nProcess: ${id_command.process || "N/A"}\n`;

        if (command.eq_solving?.do_action) {
            content += `\nEQ Solving:\n  Wait Before: ${command.eq_solving.wait_before || "N/A"}\n  Wait After: ${command.eq_solving.wait_after || "N/A"}\n`;
        }
        if (command.auto_focus?.do_action) {
            content += `\nAuto focus:\n  Wait Before: ${command.auto_focus.wait_before || "N/A"}\n  Wait After: ${command.auto_focus.wait_after || "N/A"}\n`;
        }

        setFileContent(content);
    };

    const selectSession = () => {
        if (selectedFiles.length > 0) {
            setSessionFiles((prevFiles) => prevFiles.filter((file) => !selectedFiles.includes(file)));
            setSelectedFiles([]);
            setFileContent("");
        }
    };

    return (
        <div className="overview-session-container">
            <h2 className="overview-session-title">Available Sessions:</h2>
            <div className="overview-session-content">
                <select
                    multiple
                    size={10}
                    onChange={handleSelectionChange}
                    className="overview-session-select"
                >
                    {sessionFiles.map((file, index) => (
                        <option key={index} value={file}>
                            {file}
                        </option>
                    ))}
                </select>
                <textarea
                    value={fileContent}
                    readOnly
                    className="overview-session-textarea"
                />
            </div>
            <div className="overview-session-actions">
                <button onClick={selectSession} className="overview-session-btn">
                    Select Session
                </button>
                <button onClick={() => setSessionFiles(simulatedFiles)} className="overview-session-btn">
                    Refresh JSON List
                </button>
            </div>
        </div>
    );
};

export default OverviewSessionTab;
