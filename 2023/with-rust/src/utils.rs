use std::{fs::File, io::{self, BufRead}};

pub fn read_input(filename: &str) -> Vec<String> {
    let file = File::open(format!("../{}", filename)).expect("Failed to open file");
    let reader = io::BufReader::new(file);

    reader.lines().collect::<Result<_, _>>().expect("Failed to read lines")
}

pub struct Grid<T> {
    width: usize,
    values: Vec<T>,
}

impl<T> Grid<T> {
    pub fn new(width: usize, values: Vec<T>) -> Grid<T> {
        Grid {
            width,
            values,
        }
    }

    fn idx_to_pos(&self, idx: usize) -> (usize, usize) {
        let x = idx % self.width;
        let y = idx / self.width;
        (x, y)
    }

    pub fn at(&self, x: usize, y: usize) -> Option<&T> {
        let position = x + y * self.width;
        if position >= self.values.len() {
            return None;
        }
        return self.values.get(position as usize);
    }

    pub fn surroundings(&self, x: usize, y: usize) -> Vec<&T> {
        let mut surroundings: Vec<&T> = Vec::new();
        let pos: Vec<(isize, isize)> = vec![
            (-1 , -1) , (-1 , 1) , (-1 , 0) , (1 , -1) ,
            ( 1 ,  1) , ( 1 , 0) , ( 0 ,-1) , (0 ,  1)  ,
        ];

        for (dx, dy) in pos {
            if (x as isize + dx) < 0 || (y as isize + dy) < 0 {
                continue;
            }

            let cx = x as isize + dx;
            let cy = y as isize + dy;

            if let Some(value) = self.at(cx as usize, cy as usize) {
                surroundings.push(value);
            } 
        }

        surroundings
    }

    pub fn each<F>(&self, mut f: F)
    where
        F: FnMut((usize, usize), &T),
    {
        for (idx, value) in self.values.iter().enumerate() {
            let pos = self.idx_to_pos(idx);
            f(pos, value);
        }
    }
}
