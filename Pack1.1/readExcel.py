import xlrd
import os.path

wb = xlrd.open_workbook('./map.xlsx')
wb.sheet_names()
sh = wb.sheet_by_index(0)

start_row = int(sh.cell(0,1).value)
start_col = int(sh.cell(0,2).value)
end_row = int(sh.cell(1,1).value)
end_col = int(sh.cell(1,2).value)
print 'start_row', start_row
print 'start_col', start_col
print 'end_row', end_row
print 'end_col', end_col

i = start_row - 1

file = open("output.txt", "w")
file.write("[\n")
while i < end_row:
	j = start_col - 1
	while j < end_col:
		print 'Current i', i
		print 'Current j', j
		Load = int(sh.cell(i,j).value)
		print 'load', Load
		
		if (i == (end_row - 1)) and (j == (end_col - 1)):
			DB1 = str(Load) + "\n];"
		elif (j == (end_col - 1)):
			DB1 = str(Load) + ",\n"
		else :
			DB1 = str(Load) + ", "

		file.write(DB1)
		j += 1
	i += 1

file.close