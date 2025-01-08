import React, {useEffect, useRef, useState} from 'react';
import SheetList from './components/SheetList';
import SheetEditor from './components/SheetEditor';
import {getBrowserName, loadDataFromStorage, saveDataToStorage} from './utils/storage';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import './App.css';

export default function App() {
    const [sheets, setSheets] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [allTags, setAllTags] = useState([]);
    const fileInputRef = useRef(null);

    const [dimensions, setDimensions] = useState({width: 500, height: 600});

    useEffect(() => {
        const body = document.querySelector("body");
        body.style.width = `${dimensions.width}px`;
        body.style.height = `${dimensions.height}px`;
    }, [dimensions]);

    const handleMouseDown = (e, direction) => {
        e.preventDefault();

        const startWidth = dimensions.width;
        const startHeight = dimensions.height;
        const startX = e.clientX;
        const startY = e.clientY;

        const onMouseMove = (event) => {
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes("right")) {
                newWidth = Math.min(800, Math.max(300, startWidth + (event.clientX - startX)));
            }
            if (direction.includes("left")) {
                newWidth = Math.min(800, Math.max(300, startWidth - (event.clientX - startX)));
            }
            if (direction.includes("bottom")) {
                newHeight = Math.min(600, Math.max(300, startHeight + (event.clientY - startY)));
            }
            if (direction.includes("top")) {
                newHeight = Math.min(600, Math.max(300, startHeight - (event.clientY - startY)));
            }

            setDimensions({width: newWidth, height: newHeight});
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    useEffect(() => {
        // Завантаження даних із сховища
        async function loadData() {
            try {
                const loadedSheets = await loadDataFromStorage('sheets');
                const loadedTags = await loadDataFromStorage('allTags');
                setSheets(loadedSheets);
                setAllTags(loadedTags);
            } catch (error) {
                console.error('Error loading data from storage:', error);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        // Збереження даних у сховище
        async function saveData() {
            try {
                await saveDataToStorage('sheets', sheets);
                await saveDataToStorage('allTags', allTags);
                console.log('Data saved to storage:', {sheets, allTags});
            } catch (error) {
                console.error('Error saving data to storage:', error);
            }
        }

        saveData();
    }, [sheets, allTags]);

    const addNewSheet = () => {
        const newSheet = {
            id: Date.now(),
            name: 'New Sheet',
            content: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setSheets([newSheet, ...sheets]);
    };

    const updateSheet = (updatedSheet) => {
        const updatedSheets = sheets.map(sheet =>
            sheet.id === updatedSheet.id ? {...updatedSheet, updatedAt: new Date().toISOString()} : sheet
        );
        setSheets(updatedSheets);
        setSelectedSheet(updatedSheet);
    };

    const updateTags = (newTags) => {
        setAllTags(newTags);
    };

    const deleteSheet = (sheetId) => {
        setSheets(sheets.filter(sheet => sheet.id !== sheetId));
        if (selectedSheet && selectedSheet.id === sheetId) {
            setSelectedSheet(null);
        }
    };

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const downloadSheet = (sheet) => {
        const plainTextContent = stripHtmlTags(sheet.content);  // Очистити HTML
        const blob = new Blob([plainTextContent], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sheet.name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportAllSheets = async () => {
        const zip = new JSZip();

        // Додати всі аркуші як файли до архіву
        sheets.forEach(sheet => {
            zip.file(`${sheet.name}.txt`, sheet.content || '');
        });

        // Створити та зберегти архів
        const content = await zip.generateAsync({type: 'blob'});
        saveAs(content, 'sheets.zip');
    };


    const importSheets = () => {
        const browserName = getBrowserName();

        if (browserName === 'Firefox') {
            openUploadWindow();
        } else if (browserName === 'Chrome') {
            fileInputRef.current.click(); // Викликати прихований input для завантаження
        }
    };

    const openUploadWindow = () => {
        const popupWidth = 400;
        const popupHeight = 300;
        const left = (screen.width / 2) - (popupWidth / 2);
        const top = (screen.height / 2) - (popupHeight / 2);

        // Відкриває нову вкладку для завантаження у Firefox
        browser.windows.create({
            url: 'upload.html', // Сторінка завантаження
            type: 'popup',
            width: popupWidth,
            height: popupHeight,
            left,
            top,
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                const newSheet = {
                    id: Date.now(),
                    name: file.name.replace('.txt', ''),
                    content,
                    tags: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Додаємо новий аркуш
                setSheets((prevSheets) => [newSheet, ...prevSheets]);
            };

            reader.readAsText(file);
        }
    };

    const filteredSheets = sheets.filter(sheet =>
        sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedSheets = [...filteredSheets].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            <div
                className="resize-handler left"
                onMouseDown={(e) => handleMouseDown(e, "left")}
            ></div>
            <div
                className="resize-handler bottom"
                onMouseDown={(e) => handleMouseDown(e, "bottom")}
            ></div>
            <div
                className="resize-handler bottom-left"
                onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
            ></div>
            {selectedSheet ? (
                <SheetEditor
                    sheet={selectedSheet}
                    updateSheet={updateSheet}
                    closeEditor={() => setSelectedSheet(null)}
                    allTags={allTags}
                />
            ) : (
                <SheetList
                    sheets={sortedSheets}
                    addNewSheet={addNewSheet}
                    selectSheet={setSelectedSheet}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    allTags={allTags}
                    updateTags={updateTags}
                    deleteSheet={deleteSheet}
                    downloadSheet={downloadSheet}
                    exportAllSheets={exportAllSheets} // Новий метод
                    importSheets={importSheets} // Новий метод
                    handleFileUpload={handleFileUpload} // Новий метод
                    fileInputRef={fileInputRef}
                />
            )}
        </div>
    );
}
