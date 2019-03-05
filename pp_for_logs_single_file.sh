awk '{gsub("__LOC__", FILENAME":"FNR)}1' $1 > ppp/$1
