import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";

function App() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);

  const passwordRef = useRef(null);

  // using useCallback so that it can memoize the function as it will be used again and again
  const passwordGenerator = useCallback(() => {
    let pass = "";

    // the random password will made by picking random char from this str variable
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) {
      str += "0123456789";
    }
    if (charAllowed) {
      str += "!@#$%^&*()-_=+{}[]~`";
    }

    for (let i = 1; i <= passwordLength; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      // above char variable is the index of char that is picked from the str
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [passwordLength, numberAllowed, charAllowed, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    //to hightlight the copied password in input field
    passwordRef.current.selectionStart = 0;
    passwordRef.current.selectionEnd = 999;
    passwordRef.current?.select();

    window.navigator.clipboard.writeText(passwordRef.current.value);

    setIsPasswordCopied(true);
  }, [password]);

  // useEffect to control the state of isPasswordCopied
  useEffect(() => {
    setIsPasswordCopied(false);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [passwordLength, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg p-4 my-8 text-orange-500 bg-gray-700">
        <h1 className="text-white text-center my-3">Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3 bg-white placeholder-gray-400"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            className={`outline-none text-white px-3 py-0.5 shrink-0 cursor-pointer ${
              isPasswordCopied ? "bg-blue-400" : "bg-blue-700"
            }`}
            onClick={copyPasswordToClipboard}
          >
            {isPasswordCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row text-sm gap-2">
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              min={6}
              max={100}
              value={passwordLength}
              className="cursor-pointer"
              onChange={(e) => setPasswordLength(e.target.value)}
            />
            <label>Length: {passwordLength}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => {
                setNumberAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="numberInput">Number</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="charInput"
              onChange={() => {
                setCharAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="charInput">Characters</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
