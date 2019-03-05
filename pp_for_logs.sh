#/bin/bash
files=`find ./src -name "*.ts"`
rm -rf ppp
mkdir ppp
cp -rf src ppp
for file in $files
do
    ./pp_for_logs_single_file.sh $file
done
