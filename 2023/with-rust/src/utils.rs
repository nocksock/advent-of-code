use std::{fs::File, io::{self, BufRead}};

pub fn read_input(filename: &str) -> Vec<String> {
    let file = File::open(format!("../{}", filename)).expect("Failed to open file");
    let reader = io::BufReader::new(file);

    reader.lines().collect::<Result<_, _>>().expect("Failed to read lines")
}
