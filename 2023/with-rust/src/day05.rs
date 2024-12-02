use std::collections::HashMap;

trait RangedMap<T> {
    fn add_range(&mut self, start_key: T, start_value: T, range: T);
}

impl RangedMap<usize> for HashMap<usize, usize> {
    fn add_range(&mut self, start_key: usize, start_value: usize, range: usize) {
        for i in 0..range {
            self.insert(start_key+i, start_value+i);
        }
    }
}

pub fn solve(lines: Vec<String>, part_b: bool) -> u32 {
    let mut maps: HashMap<&str, HashMap<usize, usize>> = HashMap::new();
    let mut body = lines.iter().peekable();
    let _first_line = body.next();

    let mut current_map: Option<&mut HashMap<usize, usize>> = None;
    while let Some(line) = body.next() {
        if line == "" {
            if let Some(next) = body.peek() {
                current_map = Some(maps.entry(next).or_insert_with(HashMap::new));
                body.next();
                continue
            }
        }

        if let Some(cm) = current_map.as_mut() {
            let parts: Vec<usize> = line.splitn(3, " ").map(|v| v.parse().unwrap()).collect();
            cm.add_range(parts[0], parts[1], parts[2]);
        }
    }

    // do the thing
    println!("maps: {:?}", maps);

    0
}

#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use crate::day05::*;
    use crate::utils::*;

    #[test]
    fn test_day05_a() {
        let ranged_map: HashMap<usize, usize> = HashMap::new();
        let sample = read_input("05.sample");
        assert_eq!(35, solve(sample, false));
    }

    // #[test]
    // fn test_day05_b() {
    //     let sample = read_input("05.sample");
    //     assert_eq!(??, solve(sample, true));
    // }
}
