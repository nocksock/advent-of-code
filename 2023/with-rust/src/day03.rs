use crate::utils::Grid;

trait Symbol {
    fn is_symbol(self) -> bool;
}

impl Symbol for char {
    fn is_symbol(self) -> bool {
        !self.is_digit(10) && self != '.'
    }
}


pub fn solve(lines: Vec<String>, _part_b: bool) -> usize {
    let width = lines[0].len().try_into().unwrap();
    let grid = Grid::new(width, lines.join("").chars().collect());
    let mut numbers: Vec<usize> = Vec::new();
    let mut current_number = 0;
    let mut is_collecting = false;
    let mut found_symbol = false;

    grid.each(|(x, y), c| {
        if c.is_digit(10) {
            if is_collecting {
                current_number = current_number * 10 + c.to_digit(10).unwrap() as usize;
            } else {
                current_number = c.to_digit(10).unwrap() as usize;
                is_collecting = true;
            }

            let surroundings = grid.surroundings(x, y);
            for s in surroundings {
                if s.is_symbol() {
                    found_symbol = true;
                    break;
                }
            }

        } else {
            if is_collecting {
                if found_symbol { numbers.push(current_number) }
                current_number = 0;
                found_symbol = false;
                is_collecting = false;
            }
        }
    });

    numbers.iter().sum::<usize>()
}

#[cfg(test)]
mod test {
    use crate::day03::*;
    use aoc::utils::*;

    #[test]
    fn test_sample_a() {
        let sample = read_input("03.sample");
        assert_eq!(4361, solve(sample, true));
    }
}
