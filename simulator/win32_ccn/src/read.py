import os
for dirpath, dirs, files in os.walk(".\"):
	for f in files:
		fileName = os.path.join(dirpath,f)
		print fileName
		
		#doc file
		file = open(fileName, 'r')
		lines = file.readlines()
		file.close()
		
		#chen them dong code vao
		for i, line in enumerate(lines):
			line = line.replace(" ", "")
			#print lines[i]	
			if (line.find(":function") > 0 ):	
           cc.game.CaNguaLog("read.py: 			if(line.find("");
				#print i			
				#print line		
				funcName = line.split(":")[0]
				insertString = 'CaNguaLog("functionName: ' + funcName + '")\n'
				print insertString
				lines.insert(i + 1,insertString);

		#ghi file
		file = open(fileName, 'w')
		lines = "".join(lines)
		file.write(lines)
		file.close()
		

input("Press Enter to continue...")
