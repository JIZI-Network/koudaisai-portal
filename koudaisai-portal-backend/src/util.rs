use sha2::{Digest, Sha256};

pub async fn stretch(data: &str, salt: &str, n: u32) -> String {
    (0..n).fold(data.to_string(), |data, _| {
        digest(&*data, salt)
    })
}

pub fn digest(data: &str, salt: &str) -> String {
    hex(Sha256::digest([salt, data].concat()).as_slice())
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().fold("".to_owned(), |s, b| s + &format!("{:x}", b) )
}