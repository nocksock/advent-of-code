use std::collections::HashSet;

fn main() {
    let input = include_str!("../../../01.input")
        .lines()
        .map(|l| l.parse::<i32>().unwrap())
        .collect::<Vec<i32>>();

    println!(
        "Part 1: {}",
        find_pair_sum(input.as_slice(), 2020).expect("Pair sum not found")
    );

    println!(
        "Part 2: {}",
        find_triple_sum(input.as_slice(), 2020).expect("Triple sum not found")
    );
}

fn find_pair_sum(items: &[i32], sum: i32) -> Option<i32> {
    let mut checked_nums: HashSet<i32> = HashSet::new();

    for num in items {
        let other = sum - num;
        if checked_nums.contains(&other) {
            return Some(num * other);
        }
        checked_nums.insert(*num);
    }

    None
}

#[derive(Eq, Hash)]
struct LooseTuple(usize, usize);

impl PartialEq for LooseTuple {
    fn eq(&self, other: &Self) -> bool {
        return self.0 == other.0 && self.1 == other.1
            || (self.1 == other.0 && self.1 == other.0);
    }
}

fn find_triple_sum(items: &[i32], sum: i32) -> Option<i32> {
    let mut checked_nums: HashSet<i32> = HashSet::new();
    for (a_index, a) in items.iter().enumerate() {
        for b in items.iter().skip(a_index + 1) {
            let comp = sum - a - b;
            checked_nums.insert(*b);
            if checked_nums.contains(&comp) {
                return Some(a * b * comp)
            }
        }
    }
    None
}

#[cfg(test)]
mod test {
    use crate::find_triple_sum;

    #[test]
    fn test_pair_input() {
        let items = vec![1721, 979, 366, 299, 675, 1456];
        assert_eq!(Some(514579), super::find_pair_sum(&items, 2020))
    }

    #[test]
    fn test_samey() {
        assert!(super::LooseTuple(1, 2) == super::LooseTuple(2, 1));
        assert!(super::LooseTuple(2, 1) == super::LooseTuple(2, 1));
        assert!(super::LooseTuple(1, 1) == super::LooseTuple(1, 1));
    }

    #[test]
    fn test_triple_input() {
        let items = vec![1721, 979, 366, 299, 675, 1456];
        assert_eq!(Some(241861950), find_triple_sum(&items, 2020))
    }
}
