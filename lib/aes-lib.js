/*
The MIT License (MIT)

Copyright (c) 2015 kyle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/kyleruss/aes-lib-js
*/
function Structure() {}

//------------------------------------------------------------------------------------------------------
//											AES S-BOX
//------------------------------------------------------------------------------------------------------
Structure.sbox = 
[
	[ 0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76 ],
	[ 0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0 ],
	[ 0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15 ],
	[ 0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75 ],
	[ 0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84 ],
	[ 0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF ],
	[ 0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8 ],
	[ 0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2 ],
	[ 0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73 ],
	[ 0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB ],
	[ 0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79 ],
	[ 0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08 ],
	[ 0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A ],
	[ 0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E ],
	[ 0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF ],
	[ 0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16 ]
];
//------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------------
//										AES INVERSE S-BOX
//------------------------------------------------------------------------------------------------------
Structure.inverseSbox = 
[
	[ 0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5, 0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB ],
	[ 0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF, 0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB ],
	[ 0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23, 0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E ],
	[ 0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24, 0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25 ],
	[ 0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92 ],
	[ 0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9, 0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84 ],
	[ 0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3, 0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06 ],
	[ 0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F, 0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B ],
	[ 0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC, 0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73 ],
	[ 0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35, 0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E ],
	[ 0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5, 0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B ],
	[ 0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79, 0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4 ],
	[ 0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7, 0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F ],
	[ 0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A, 0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF ],
	[ 0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5, 0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61 ],
	[ 0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6, 0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D ]
];
//-----------------------------------------------------------------------------------------------------





//-------------------------------------------------------------------------------------------------
//											ROUND COEFFICIENTS 
//-------------------------------------------------------------------------------------------------
Structure.rcon = 
[
	0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a,
	0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39,
	0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
	0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8,
	0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef,
	0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc,
	0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b,
	0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3,
	0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94,
	0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20,
	0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35,
	0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f,
	0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04,
	0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63,
	0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
	0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d
];
//-------------------------------------------------------------------------------------------------


//Mix column matrix used in MixColumns layer
Structure.mixColMatrix = 
[
	[ 0x02, 0x03, 0x01, 0x01 ],
	[ 0x01, 0x02, 0x03, 0x01 ],
	[ 0x01, 0x01, 0x02, 0x03 ],
	[ 0x03, 0x01, 0x01, 0x02 ]
];


//Inverse mix columns matrix used in InverseMixColumns layer
//Values are the inverse in GF(2^8) of those in mixColMatrix 
Structure.inverseMixColMatrix = 
[
	[ 0x0e, 0x0b, 0x0d, 0x09 ],
	[ 0x09, 0x0e, 0x0b, 0x0d ],
	[ 0x0d, 0x09, 0x0e, 0x0b ],
	[ 0x0b, 0x0d, 0x09, 0x0e ]
];

//Returns the round coefficient at index
Structure.getRconEntry = function(index)
{
	var rc =  Structure.convert(this.rcon[index].toString(16), 16, 2);
	return rc;
};


//Returns the mix column entry a[row][column]
//returns the inverse value if Mode::DECRYPT
Structure.getMixColEntry = function(row, col, encrypt_mode)
{
	var value;
	if(encrypt_mode)
		value =  Structure.mixColMatrix[row][col].toString(16);
	else
		value =  Structure.inverseMixColMatrix[row][col].toString(16);

	return Structure.convert(value, 16, 2);
};


//Returns the s-box entry a[row][column]
//returns the inverse value if Mode::DECRYPT
Structure.getSboxEntry = function(row, column, encrypt_mode)
{
	var value;
	if(encrypt_mode)
		value = Structure.sbox[row][column].toString(16);
	else
		value = Structure.inverseSbox[row][column].toString(16);
	
	return Structure.convert(value, 16, 2);
};


//Returns the sbox entry for the bin
//row and column of s-box table are derived from bin
//left-most bits = row, right-most bits = column
Structure.getSboxEntryFromBin = function(bin, encrypt_mode)
{
	bin = Structure.padBin(bin);
	var row = Structure.convert(bin.substring(0, 4), 2, 10);
	var col = Structure.convert(bin.substring(4, 8), 2, 10);

	return Structure.getSboxEntry(row, col, encrypt_mode);
};


//pads a binary string up to 8bits
Structure.padBin = function(bin)
{
	if(bin.length >= 8) return bin;

	var b = '00000000';
	return b.substring(0, b.length - bin.length) + bin;
};

//pads a hex string up 00
Structure.padHex = function(hex)
{
	if(hex.length >= 2) return hex;

	var h = '00';
	return h.substring(0, h.length - hex.length) + hex;
};


//Converts the value from base 'from' to base 'to'
Structure.convert = function(value, from, to)
{
	if(from == 2) value = Structure.padBin(value);
	var parsed = parseInt(value, from).toString(to);

	if(to == 2)
		return Structure.padBin(parsed);
	else
		return parsed; 
};

//Prints out the 4 bytes in row
Structure.printStateRow = function(state, rowNumber)
{
	var colStr = '';
	for(var col = 0; col < 4; col++)
		colStr += state[rowNumber][col] + ' ';

	console.log(colStr + '\n');
};


//Prints out the state 4x4 matrix 
Structure.printState = function(state)
{
	for(var row = 0; row < 4; row++)
	{
		var colStr = '';
		for(var col = 0; col < 4; col++)
			colStr += state[row][col] + ' ';
		
		console.log(colStr + '\n');
	}
};

//Returns the string contained in the state(s)
Structure.statesToString = function(states)
{
	var numStates	=	states.length;
	var message		=	"";

	for(var i = 0; i < numStates; i++)
		message += Structure.stateToString(states[i]);

	return message;
};


//Prints out the string represented by the states
//numStates: size(states)
Structure.printDecryptedMessage = function(states)
{
	var numStates	=	states.length;
	var message		=	"";

	for(var i = 0; i < numStates; i++)
		message += Structure.stateToString(states[i]);

	return message;
};

//Creates the skeleton for the state 
Structure.createState = function()
{
	var state = [];
	for(var i = 0; i < 4; i++)
		state.push([]);
	

	return state;
};


//Adds the bytes in str into the passed state
Structure.makeState = function(str)
{
	var state = Structure.createState();
	var index = 0;

	for(var row = 0; row < 4; row++)
		for(var col = 0; col < 4; col++)
			state[col][row] = str[index++];
	
	return state;
};

//Creates and returns a randomly generated state
//Useful for generation of keys/IV's
Structure.generateState = function()
{
	var state = Structure.createState();
	var dec, next;

	for(var row = 0; row < 4; row++)
	{
		for(var col = 0; col < 4; col++)
		{
			dec				=	Math.floor(Math.random() * 256);
			next			=	String.fromCharCode(dec).toString(2);
			state[col][row]	=	next;
		}
	}

	return state;
};

//Copies the state b into a
Structure.copyState = function(stateA, stateB)
{
	for(var row = 0; row < 4; row++)
		for(var col = 0; col < 4; col++)
			stateA[row][col] = stateB[row][col];
};


//puts the character bytes in the str into a state
//values are converted into binary 
Structure.strToState = function(str)
{
	var bytes = [];
	for(var i = 0; i < 16; i++)
	{
		if(str.length <= i)
			bytes.push(Structure.padBin(""));
		
		else
			bytes.push(Structure.padBin(str.charCodeAt(i).toString(2)));
	}

	return Structure.makeState(bytes);
};

//Returns a hex representation of the state
Structure.stateToHex = function(state)
{
	var str = "";
	for(var row = 0; row < 4; row++)
	{
		for(var col = 0; col < 4; col++)
		{
			var hex		=	Structure.padHex(Structure.convert(state[col][row], 2, 16));

			if(hex != '00')
				str	 +=	hex;
		}
	}

	return str;
};


//puts the hex into a state
//values sare converted into binary
Structure.hexToState = function(hex)
{
	if(hex.length != 32) return;

	var bytes	=	[];
	var index	=	0;
	var hIndex	=	0;

	while(index < 16)
	{
		bytes.push(Structure.convert(hex.substring(hIndex, hIndex + 2), 16, 2));
		hIndex += 2;

		index++;
	}

	return Structure.makeState(bytes);
};

//Returns the string value of the state
Structure.stateToString = function(state)
{
	var str = "";
	for(var row = 0; row < 4; row++)
	{
		for(var col = 0; col < 4; col++)
		{
			var hex		=	Structure.padHex(Structure.convert(state[col][row], 2, 16));

			if(hex != '00')
				str			+=	String.fromCharCode(parseInt(hex, 16));
		}
	}

	return str;
};


//returns the number of states (blocks) needed for the text
Structure.getNumStates = function(str)
{
	return Math.ceil(str.length / 16);
};


//performs a bitwise XOR: a XOR b
Structure.xor = function(a, b)
{
	a = parseInt(a, 2);
	b = parseInt(b, 2);

	return Structure.padBin((a ^ b).toString(2));
};


//Performs matrix/state addition in GF(2^8)
//Each entry is xor'd with the corresponding entry
Structure.addStates = function(stateA, stateB)
{
	for(var row = 0; row < 4; row++)
		for(var col = 0; col < 4; col++)
			stateA[col][row] = Structure.xor(stateA[col][row], stateB[col][row]);
};


//bitwise left shifts a by b
Structure.shiftLeft = function(a, b)
{
	a = parseInt(a, 2);
	return Structure.padBin((a << b).toString(2)).slice(-8);
};


//bitwise right shifts a by b
Structure.shiftRight = function(a, b)
{
	a = parseInt(a, 2);
	return Structure.padBin((a >> b).toString(2)).slice(-8);
};


//returns the column at colNum in the matrix
Structure.getColumn = function(state, column)
{
	var col = [];
	col.push(state[0][column]);
	col.push(state[1][column]);
	col.push(state[2][column]);
	col.push(state[3][column]);

	return col;
};

//Creates states from the string
Structure.makeStates = function(str)
{
	var len			=	str.length;
	var strIndex	=	0;
	var numStates	=	Structure.getNumStates(str);
	var states		=	[[[]]];

	for(var sIndex = 0; sIndex < numStates; sIndex++)
	{
		var nextState;
		var nextStr;

		if(strIndex + 16 > len)
			nextStr = str.substring(strIndex, len);

		else
			nextStr = str.substring(strIndex, strIndex + 16);

		strIndex		+=	16;
		nextState		=	Structure.strToState(nextStr);
		states[sIndex]	=	nextState;
	}
			
	return states;
};
function Engine() {}

//Byte substitution layer
//Substitute each state entry with the corresponding sbox entry
//state: 4x4 state matrix
//encrypt_mode: bool, pass true/false for encrypting/decrypting
//decryption subtitutes bytes from Structure.inverseSbox
Engine.byteSub = function(state, encrypt_mode)
{
	for(var row = 0; row < 4; row++)
	{
		for(var col = 0; col < 4; col++)
		{
			//decryption subtitutes bytes from Structure.inverseSbox
			//encryption substitutes bytes from Structure.sbox
			state[row][col] = Structure.getSboxEntryFromBin(state[row][col], encrypt_mode);
		}
	}
};


//Shift rows layer
//encryption: shifts rows 1..4 by 3..1 positions right
//decryption: shifts rows 1..4 by 1..3 positions right
//state: 4x4 state matrix
//encrypt_mode: bool, pass true/false for encrypting/decrypting
Engine.shiftRows = function(state, encrypt_mode)
{
	var numPositions;
	//shift rows 1..4 in state 3..1 positions right
	if(encrypt_mode)
	{
		for(numPositions = 3, row = 1; numPositions > 0; numPositions--, row++)
			Engine.shiftRow(state[row], numPositions);
	}

	//shift rows 1..4 in state 1..3 positions right
	else
	{
		for(numPositions = 1, row = 1; numPositions <= 3; numPositions++, row++)
			Engine.shiftRow(state[row], numPositions);
	}
};

//Shifts the passed row numPositions right
//row: array to shift
//numPositions: number of positions to shift each position right
Engine.shiftRow = function(row, numPositions)
{
	//copy shifted positions into temp
	//-------------------------------------------
	var temp = [];
	for(var i = 0; i < 4; i++)
	{
		var index	= (i + numPositions) % 4;
		temp[index] = row[i];
	}
	//-------------------------------------------

	//Copy temp with shifted positions into row
	row.splice.apply(row, [0, 4].concat(temp));
};



//Mix columns layer
//Performs a linear transformation of the state 
//Multiplies the state by the mix columns matrix
Engine.mixColumns = function(state, encrypt_mode)
{
	//Perform the multiplication of the state and mixColmatrix 
	//Copy the product in temp
	var temp = Structure.createState();
	for(var row = 0; row < 4; row++)
	{
		for(var col = 0; col < 4; col++)
		{
			temp[col][row]	= 
				Structure.xor
  				(
					Engine.mixMultiply(state[0][row], Structure.getMixColEntry(col, 0, encrypt_mode)),
					Engine.mixMultiply(state[1][row], Structure.getMixColEntry(col, 1, encrypt_mode))
		  		);

			temp[col][row] = Structure.xor(temp[col][row], Engine.mixMultiply(state[2][row], Structure.getMixColEntry(col, 2, encrypt_mode)));
			temp[col][row] = Structure.xor(temp[col][row], Engine.mixMultiply(state[3][row], Structure.getMixColEntry(col, 3, encrypt_mode)));	
		}
	}

	Structure.copyState(state, temp);
};

//Performs multiplication of the stateEntry and mixEntry
//Multiplication is in GF(2^8)
Engine.mixMultiply = function(stateEntry, mixEntry)
{
	var mixHex		=	Structure.padHex(Structure.convert(mixEntry, 2, 16));
	var stateHex	=	Structure.padHex(Structure.convert(stateEntry, 2, 16));
	var product;

	//mix col entry is <= 3
	//skip peasants algorithm
	if(mixHex <= 3)
	{
		//multiply by 1 is identity
		if (mixHex == '01')
			return stateEntry;

		//multiply by x (left shift 1)
		product = Structure.shiftLeft(stateEntry, 1);

		if (mixHex == '03')
			product = Structure.xor(product, stateEntry); 

		//left most bit is set (carry)
		if (stateEntry.charAt(0) == '1')
			product = Structure.xor(product, Structure.convert('1b', 16, 2));

		return product;
	}

	//mix col entry is > 3
	//use peasants algorithm to get product
	else
	{ 
		if (mixHex == 0 || stateHex == 0)
			return Structure.padBin("");

		var a, b, carry;
		a		=	stateEntry;
		b		=	mixEntry;
		product =	Structure.padBin("");

		for (var i = 0; i < 8; i++)
		{
			//if rightmost bit of b is 1, xor product and a
			if (b.charAt(7) == '1')
				product = Structure.xor(product, a);

			//shift b 1 bit right
			b = Structure.shiftRight(b, 1);

			//set carry before shifting a
			//carry is true if leftmost bit of a is set
			carry = (a.charAt(0) == '1');

			//shift a 1 bit left
			a = Structure.shiftLeft(a, 1);

			//carrying bit, xor a with 0x1b
			if (carry)
				a = Structure.xor(a, Structure.convert('1b', 16, 2));
		}

		return product;
	
	}
};
function KeySchedule(key, numRounds)
{
	if(numRounds > 0)
	{
		this.numSubkeys =	numRounds + 1;
		this.schedule	=	[];
		this.initKeys(key);
	}
}

//Performs the key expansion on the key
//generates numSubkeys in the schedule
KeySchedule.prototype.initKeys = function(key)
{
	//set first 16 bytes of schedule as private key
	for(var col = 0; col < 4; col++)
	{
		var colBytes				=	Structure.getColumn(key, col);
		this.schedule[col * 4]		=	colBytes[0];
		this.schedule[col * 4 + 1]	=	colBytes[1];
		this.schedule[col * 4 + 2]	=	colBytes[2];
		this.schedule[col * 4 + 3]	=	colBytes[3];
	}

	var keyLen	=	16; //fixed size of the key
	var front	=	16; //schedule index
	var i		=	1; //rcon index 
	var schSize	=	this.numSubkeys * 16; //size of the schedule

	while(front < schSize)
	{
		//next 4 bytes of key to be added to schedule
		var next	=	[];

		//copy previous 4 bytes into next
		for(var j = 0, k = (front - 4); j < 4; j++, k++)
			next[j] = this.schedule[k];

		//perform the core operations on next and incr i
		//core is performed every keyLen bytes of key
		if(front % keyLen == 0)
		{
			this.core(next, i);
			i++;
		}

		//set next 4 bytes of schedule as next xor with the prev 16 bytes, 4 byte block
		//increments front
		for(var j = 0; j < 4; j++, front++)
			this.schedule[front] = Structure.xor(this.schedule[front - keyLen], next[j]);
		
	}
};

//circular left shift the word by 1 byte
KeySchedule.prototype.rotate = function(word)
{
	var temp = word[0];
	for(var i = 0; i < 3; i++)
		word[i] = word[i + 1];

	word[3] = temp;
};


//performs the keyschedule core operations
//rotates the word
//applies the sbox
//xors the rcon entry on word
KeySchedule.prototype.core = function(word, i)
{
	//rotate word left 1 byte
	this.rotate(word);


	//apply s-box on word
	//uses Structure.sbox for both encrypt/decrypt
	for(var j = 0; j < 4; j++)
		word[j]	=	Structure.getSboxEntryFromBin(word[j], true);

	
	//add round coefficient to left most byte of word;
	word[0] = this.addRoundCoeff(word[0], i);
};


//xors entry with the rcon entry at index i
KeySchedule.prototype.addRoundCoeff = function(entry, i)
{
	var rconEntry	=	Structure.getRconEntry(i);
	var result		=	Structure.xor(entry, rconEntry);

	return result;
};


//returns a key in the schedule for the round at roundNum
KeySchedule.prototype.getKey = function(roundNum)
{
	var key		=	Structure.createState();	
	var sIndex	=	(roundNum * 16);

	//copy round key into key
	for(var row = 0; row < 4; row++)
		for(var col = 0; col < 4; col++)
			key[col][row] = this.schedule[sIndex++];

	return key;
};

//Returns the number of round/sub-keys in the schedule
KeySchedule.prototype.getNumSubkeys = function()
{
	return this.numSubkeys;
};
function AES() {}

//Encrypts the passed state block
//passed state is mutated with encrypted state
//state: 128bit block: 4x4 state matrix
//keyScheudle: loaded KeySchedule with your pkey
//keySize: length of pkey: 128/192/256
AES.encryptBlock = function(state, keySchedule, keySize)
{
	//Add round 0 key
	//------------------------------------	
	var roundKey = keySchedule.getKey(0);
	Structure.addStates(state, roundKey);
	//------------------------------------
	
	//Perform internals for numRounds
	var numRounds = AES.getNumRounds(keySize);
	for(var round = 1; round <= numRounds; round++)
	{
		//Byte substitution layer
		//Confusion component
		Engine.byteSub(state, true);


		//Difussion components
		//-----------------------------------------
		//Shift rows layer
		Engine.shiftRows(state, true);

		//Mix columns layer
		//Only performed on rounds 1..numRounds-1
		if(round != numRounds)
			Engine.mixColumns(state, true);
		//-----------------------------------------
		
		
		//Add round key to state
		roundKey = keySchedule.getKey(round);
		Structure.addStates(state, roundKey);
	}
};


//Encrypts the passed state blocks in CBC mode
//states:	state matrice(s) to be encrypted
//key:		your private key (KeySchedule loaded inside)
//iVector:	initial vector, 128bit state matrix
//keySize:	length of key: 128/192/256
AES.encryptCBC = function(states, key, iVector, keySize)
{
	var schedule	=	new KeySchedule(key, 10);
	var numBlocks	=	states.length;

	//Make numBlocks cipher-text blocks
	for(var i = 0; i < numBlocks; i++)
	{
		//create input block
		//-------------------------------------------------
		//xor initial vector on first plain-text block
		if(i == 0)
			Structure.addStates(states[0], iVector);

		//xor previous output block
		else
			Structure.addStates(states[i], states[i - 1]);

		//-------------------------------------------------
	
			
		//encrypt input block to make cipher block
		AES.encryptBlock(states[i], schedule, keySize);
	}

	return states;
};


//Decrypts the passed state block
//passed state is mutated with decrypted state
//state:		128bit block/4x4 state matrix
//keySchedule:	loaded KeySchedule with pkey
//keySize:		pkey length: 128/192/256
AES.decryptBlock = function(state, keySchedule, keySize)
{
	var roundKey;
	var numRounds	=	AES.getNumRounds(keySize);


	//Perform inverse internals for numRounds
	for(var round = numRounds; round > 0; round--)
	{
		//Add round key to state
		roundKey = keySchedule.getKey(round);
		Structure.addStates(state, roundKey);


		//Difussion components
		//-----------------------------------------
		//Inverse mix columns layer
		//Only performed on rounds 1..numRounds-1
		if(round != numRounds)
			Engine.mixColumns(state, false);

		//Inverse shift rows layer
		Engine.shiftRows(state, false);
		//-----------------------------------------


		//Confusion component
		//Inverse byte substiution layer
		Engine.byteSub(state, false);
	}

	//Add round 0 key
	//-----------------------------------------
	roundKey = keySchedule.getKey(0);
	Structure.addStates(state, roundKey);
	//-----------------------------------------
};


//Encrypts the passed plain text in CBC mode
//returns the encrypted states matrice(s)
//use encryptMessage over encryptCBC for arbtitrary plainStr length
//plainStr:		plain text to be encrypted
//key:			private key => string OR state matrix
//iVector:		initial vector => string or state matrix
//keySize:		length of private key 128/192/256
AES.encryptMessage = function(plainStr, key, iVector, keySize)
{
	//Invalid encryption input
	if(plainStr.length == 0 || AES.getNumRounds(keySize) == 0 || iVector.length > 16) return;

	var keyState, iVectorState;
	var states				=	Structure.makeStates(plainStr);

	//key or initial vector may be passed as string or state matrix
	//creates their respective matrices and sets iVectorState & keyState
	//-------------------------------------------------------------------
	//key and initial vector are passed strings
	//create their state matrices
	if(!(iVector instanceof Array) && !(key instanceof Array))
	{
		iVectorState		=	Structure.strToState(iVector);
		keyState			=	Structure.strToState(key);
	}

	//key and initial vector are state matrices 
	//set iVectorState & keyState
	else
	{
		iVectorState		=	iVector;
		keyState			=	key;
	}
	//-------------------------------------------------------------------


	//encrypt state(s) in cbc mode
	//returns the state(s)
	AES.encryptCBC(states, keyState, iVectorState, keySize);
	return states;
};


//Decrypts the passed states in CBC mode
//mutates the passed cipherStates into decrypted states
//use decryptCBC if your key/initial vector are state matrices
//states:		encrypted state matrice(s)
//keyStr:		128bit/16 length private key string
//iVectorStr:	128bit/16 length initial vector string
//keySize:		length of private key: 128/192/256
AES.decryptMessage = function(states, key, iVector, keySize)
{
	//Invalid decryption input
	if(states.length == 0 || AES.getNumRounds(keySize) == 0 || iVector.length > 16) return;

	//Create iVector & key state matrices
	var iVectorState, keyState;

	//key or initial vector may be passed as string or state matrix
	//creates their respective matrices and sets iVectorState & keyState
	//-------------------------------------------------------------------
	//key and initial vector are passed strings
	//create their state matrices
	if(!(iVector instanceof Array) && !(key instanceof Array))
	{
		iVectorState		=	Structure.strToState(iVector);
		keyState			=	Structure.strToState(key);
	}

	//key and initial vector are state matrices 
	//set iVectorState & keyState
	else
	{
		iVectorState		=	iVector;
		keyState			=	key;
	}
	//-------------------------------------------------------------------

	//Decrypt the encrypted states in CBC mode
	//states will be muted into decrypted states
	AES.decryptCBC(states, keyState, iVectorState, keySize);
	return Structure.statesToString(states);
};



//Decrypts the passed states in CBC mode
//mutates the passed cipherStates into decrypted states
//use over decryptMessage if key/iVector are matrices
//states:		encrypted state matrice(s)
//keyStr:		private key state matrix
//iVectorStr:	initial vector state matrix
//keySize:		length of private key: 128/192/256
AES.decryptCBC = function(states, key, iVector, keySize)
{
	var cipherBlocks		=	[[[]]];
	var numBlocks			=	states.length;
	var schedule			=	new KeySchedule(key, 10);

	//store the cipher text blocks before mutation
	//-------------------------------------------------
	for(var i = 0; i < numBlocks; i++)
	{
		var temp = Structure.createState();
		for(var row = 0; row < 4; row++)
			temp[row] = states[i][row].slice(0);
		
		cipherBlocks[i] = temp;
	}
	//-------------------------------------------------

	
	//create numBlocks plain-text blocks in cbc mode
	for(i = 0; i < numBlocks; i++)
	{
		//decrypt input cipher block
		//creates output block i
		AES.decryptBlock(states[i], schedule, keySize);


		//create plain text block i
		//-------------------------------------------------
		//xor initial vector on first block
		if(i == 0)
			Structure.addStates(states[0], iVector);
		
		//xor previous cipher-text block
		else
			Structure.addStates(states[i], cipherBlocks[i - 1]);
		//-------------------------------------------------

	}
};


//Returns the number of internal rounds 
//-needed for the passed keySize
//keySize: bit length of private key
//recognizes 128/192/256 bit length keys
AES.getNumRounds = function(keySize)
{
	switch(keySize)
	{
		case 128:
			return 10;
		
		case 192:
			return 12;

		case 256:
			return 14;

		default:
			return 0;
	}
};
