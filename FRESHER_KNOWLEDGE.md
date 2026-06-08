# 📚 CẨM NANG KIẾN THỨC NỀN TẢNG - FRESHER FULLSTACK (REACTJS / NODEJS)

Tài liệu này hệ thống hóa toàn bộ kiến thức chuyên môn cốt lõi cần thiết cho vị trí Fresher Fullstack. Mỗi mục đều kèm theo giải thích bản chất lý thuyết chi tiết và ví dụ thực tế dựa trên chính dự án **IoT Dashboard** của bạn để giúp bạn tự tin trả lời phỏng vấn.

---

## 🗺️ MỤC LỤC
1. [**JavaScript Core & ES6+**](#1-javascript-core--es6)
   * [1.1. Kiến Thức Nền Cốt Lõi (Core Concepts)](#11-kiến-thức-nền-cốt-lõi-core-concepts)
   * [1.2. Các Phương Thức Xử Lý Mảng Nâng Cao](#12-các-phương-thức-xử-lý-mảng-nâng-cao-array-methods)
   * [1.3. Bất Đồng Bộ: Promise & Async/Await](#13-bất-đồng-bộ-promise--asyncawait)
   * [1.4. Giao Tiếp Mạng Với Fetch API](#14-giao-tiếp-mạng-với-fetch-api-cạm-bẫy-phỏng-vấn)
   * [1.5. Cơ Chế Hoạt Động Của Event Loop](#15-cơ-chế-hoạt-động-của-event-loop-nodejs-trình-duyệt)
2. [**ReactJS Core**](#2-reactjs-core)
   * [2.1. Cấu Trúc Thành Phần & Luồng Dữ Liệu](#21-cấu-trúc-thành-phần--luồng-dữ-liệu)
   * [2.2. Chi Tiết Về Các React Hooks](#22-chi-tiết-về-các-react-hooks)
   * [2.3. Điều Kiện Để Một Component Re-Render](#23-điều-kiện-để-một-component-re-render)
   * [2.4. DOM & Virtual DOM](#24-dom-document-object-model--virtual-dom)
3. [**Node.js & Express.js**](#3-nodejs--expressjs)
   * [3.1. Thiết Kế Web Server & Định Tuyến (Routing)](#31-thiết-kế-web-server--định-tuyến-routing)
   * [3.2. RESTful API Tiêu Chuẩn](#32-restful-api-tiêu-chuẩn)
   * [3.3. Cơ Chế Hoạt Động Của Middleware](#33-cơ-chế-hoạt-động-của-middleware)
   * [3.4. Xử Lý Tham Số Gửi Lên (Query, Params, Body)](#34-xử-lý-tham-số-gửi-lên-query-params-body)
4. [**Database (MongoDB & Mongoose)**](#4-database-mongodb--mongoose)
   * [4.1. Khái Niệm Cơ Bản Về NoSQL (MongoDB)](#41-khái-niệm-cơ-bản-về-nosql-mongodb)
   * [4.2. Các Câu Lệnh CRUD Với Mongoose](#42-các-câu-lệnh-crud-với-mongoose)
   * [4.3. Phân Trang Phía Server (Server-side Pagination)](#43-phân-trang-phía-server-server-side-pagination)
5. [**Git & Công Cụ Debug**](#5-git--công-cụ-debug)
   * [5.1. Git Workflow Cơ Bản](#51-git-workflow-cơ-bản)
   * [5.2. Công Cụ Debugging Thực Tế (Chrome DevTools)](#52-công-cụ-debugging-thực-tế-chrome-devtools)

---

## 1. JAVASCRIPT CORE & ES6+

### 1.1. Kiến Thức Nền Cốt Lõi (Core Concepts)
*   **Phân biệt các kiểu khai báo Hàm (Functions):**
    1.  **Function Declaration (Khai báo hàm):**
        ```javascript
        function getSensors() { ... }
        ```
        *Đặc điểm:* Hỗ trợ **Hoisting** (có thể gọi hàm trước khi dòng định nghĩa hàm được chạy). Có ngữ cảnh `this` riêng, thay đổi động tùy thuộc vào đối tượng gọi nó.
    2.  **Function Expression (Biểu thức hàm):**
        ```javascript
        const getSensors = function() { ... };
        ```
        *Đặc điểm:* Không hỗ trợ Hoisting (phải định nghĩa trước rồi mới gọi). Có ngữ cảnh `this` riêng.
    3.  **Arrow Function (Hàm mũi tên - ES6):**
        ```javascript
        const getSensors = () => { ... };
        ```
        *Đặc điểm:* Không hỗ trợ Hoisting. **Không tự định nghĩa ngữ cảnh `this`** mà kế thừa `this` từ phạm vi chứa nó (Lexical `this`). Không có đối tượng `arguments` và **không thể** dùng làm hàm khởi tạo (constructor) với từ khóa `new`.
*   **Callback là gì?**
    *   *Định nghĩa:* Callback là một hàm được truyền làm đối số (argument) vào một hàm khác để thực thi sau đó.
    *   *Callback đồng bộ (Synchronous Callback):* Được gọi ngay lập tức trong quá trình thực thi mã đồng bộ.
        *   *Ví dụ:* `data.map(item => item.temperature)` hoặc `array.forEach(...)`.
    *   *Callback bất đồng bộ (Asynchronous Callback):* Không được chạy ngay, mà được đẩy vào Task Queue để chạy sau khi một tác vụ bất đồng bộ (Timer, Network, I/O) hoàn thành.
        *   *Ví dụ:* `setTimeout(() => console.log("Done"), 1000)` hoặc lắng nghe socket: `socket.on("sensors:new", (data) => { ... })`.
*   **Tham trị (Primitive Type) vs Tham chiếu (Reference Type):**
    *   **Tham trị (String, Number, Boolean, undefined, null, Symbol, BigInt):** Lưu trữ giá trị thực tế trực tiếp trong bộ nhớ Stack. Khi gán hoặc truyền vào hàm, JS sẽ copy giá trị mới độc lập.
    *   **Tham chiếu (Object, Array, Function):** Lưu địa chỉ vùng nhớ (con trỏ chỉ đến Heap) ở trong bộ nhớ Stack. Khi gán `const a = b`, cả hai biến sẽ cùng trỏ tới một vùng nhớ duy nhất. Thay đổi thuộc tính của `a` sẽ làm thay đổi `b`.
    *   **Shallow Copy (Sao chép nông) vs Deep Copy (Sao chép sâu):**
        *   *Shallow Copy:* Chỉ sao chép các thuộc tính ở cấp độ đầu tiên (sử dụng Spread Operator `const clone = { ...original }` hoặc `Object.assign()`). Nếu bên trong có đối tượng lồng nhau, địa chỉ vùng nhớ của đối tượng lồng đó vẫn bị chia sẻ.
        *   *Deep Copy:* Sao chép toàn bộ mọi cấp độ độc lập hoàn toàn. Dùng `JSON.parse(JSON.stringify(obj))` (bị mất dữ liệu kiểu Function, undefined, Date) hoặc API trình duyệt hiện đại: `structuredClone(obj)`.
*   **Các phương thức Object thiết yếu:**
    *   `Object.keys(obj)`: Trả về mảng các khóa (keys) của object.
    *   `Object.values(obj)`: Trả về mảng các giá trị (values) tương ứng.
    *   `Object.entries(obj)`: Trả về mảng chứa các cặp `[key, value]`. Cực kỳ hữu ích trong React khi duyệt map qua object state:
        ```javascript
        Object.entries(devices).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ));
        ```

### 1.2. Các Phương Thức Xử Lý Mảng Nâng Cao (Array Methods)
*   **`map()`:** Tạo ra một mảng mới bằng cách thực thi một hàm callback trên từng phần tử của mảng gốc.
*   **`filter()`:** Tạo một mảng mới chỉ chứa các phần tử thỏa mãn điều kiện logic của hàm callback.
*   **`reduce()`:** Duyệt qua các phần tử của mảng và gom tụ lại thành một giá trị duy nhất (có thể là số, chuỗi, object hoặc mảng mới).
    *   *Cú pháp:* `array.reduce((accumulator, currentValue, index, array) => { ... }, initialValue)`
    *   *Bản chất hoạt động:*
        *   `accumulator` (Biến tích lũy): Lưu giữ kết quả được trả về từ lần chạy callback trước đó.
        *   `currentValue` (Phần tử hiện tại): Giá trị của phần tử đang được duyệt.
        *   `initialValue` (Giá trị khởi tạo): Nếu được cung cấp, `accumulator` sẽ bắt đầu bằng `initialValue` ở vòng chạy đầu tiên. Nếu **không** được cung cấp, `accumulator` mặc định lấy phần tử đầu tiên của mảng và bỏ qua vòng lặp ở index 0 (chạy từ index 1).
    *   *Ví dụ tính giá trị trung bình nhiệt độ từ mảng dữ liệu:*
        ```javascript
        const avgTemp = data.reduce((sum, item) => sum + item.temperature, 0) / data.length;
        ```

### 1.3. Bất Đồng Bộ: Promise & Async/Await
*   **Promise:** Đối tượng đại diện cho kết quả của một tác vụ bất đồng bộ. Có 3 trạng thái:
    1.  `Pending`: Đang chờ xử lý.
    2.  `Fulfilled` (Resolved): Thành công, kích hoạt chuỗi `.then(data => { ... })`.
    3.  `Rejected`: Thất bại, kích hoạt `.catch(error => { ... })`.
*   **Các tĩnh phương thức (Static Methods) của Promise trong phỏng vấn:**
    *   `Promise.all(promises)`: Chạy song song nhiều promises đồng thời.
        *   *Cơ chế:* **Chỉ thành công khi TẤT CẢ các Promises thành công.** Trả về một mảng kết quả theo đúng thứ tự. Nếu chỉ cần **một** Promise bị từ chối (reject), nó lập tức hủy bỏ và ném ra lỗi của Promise lỗi đó.
        *   *Liên hệ dự án:* Dùng ở backend để truy vấn song song dữ liệu cảm biến và đếm tổng bản ghi: `Promise.all([Sensor.find(), Sensor.countDocuments()])`.
    *   `Promise.allSettled(promises)`: Chạy song song tất cả các promises.
        *   *Cơ chế:* **Luôn luôn resolved** sau khi tất cả các promises đã kết thúc (bất kể thành công hay thất bại). Trả về một mảng object mô tả trạng thái của từng promise: `{ status: 'fulfilled', value }` hoặc `{ status: 'rejected', reason }`. Tối ưu khi các tác vụ không phụ thuộc vào nhau.
    *   `Promise.race(promises)`: Chạy song song.
        *   *Cơ chế:* Trả về kết quả (thành công hoặc thất bại) của Promise **hoàn thành sớm nhất**.
    *   `Promise.any(promises)`: Chạy song song.
        *   *Cơ chế:* Trả về kết quả của Promise **thành công đầu tiên**. Chỉ reject nếu tất cả các promises đều thất bại.
*   **Bản chất của Async / Await:**
    *   Một hàm khai báo với từ khóa `async` luôn luôn trả về một **Promise**. Nếu bạn return một giá trị thông thường, JavaScript sẽ tự động bọc nó trong một `Promise.resolve(value)`.
    *   Từ khóa `await` chỉ được sử dụng bên trong hàm `async`. Nó tạm dừng việc thực thi hàm async hiện tại để đợi cho Promise phía sau settle (resolved/rejected), rồi mới chạy tiếp. 
    *   *Tại sao non-blocking:* Trong lúc `await` tạm dừng hàm async đó, JavaScript Engine sẽ giải phóng luồng chính và Event Loop tiếp tục xử lý các tác vụ khác trong Call Stack, giúp ứng dụng không bao giờ bị treo đơ.

### 1.4. Giao Tiếp Mạng Với Fetch API (Cạm Bẫy Phỏng Vấn)
*   **Cơ chế hoạt động:** `fetch(url)` gửi request mạng và trả về một Promise phân giải thành đối tượng `Response`.
*   **Tại sao luôn phải dùng 2 lần await/then?**
    *   *Bước 1:* `const res = await fetch(url);` -> Phân giải thành công ngay khi trình duyệt nhận về Header phản hồi đầu tiên từ server (xác nhận kết nối thành công). Lúc này, thân dữ liệu (body payload) vẫn đang truyền dạng stream.
    *   *Bước 2:* `const data = await res.json();` -> Bất đồng bộ đọc hết luồng dữ liệu của body và parse nó sang cấu trúc JSON. Vì quá trình đọc/parse tốn thời gian nên `res.json()` cũng trả về một Promise.
*   **Cạm bẫy phỏng vấn cực lớn (Gotcha):**
    *   **`fetch()` sẽ KHÔNG tự động reject Promise khi nhận về mã lỗi HTTP 4xx hoặc 5xx** (ví dụ: 404 Not Found, 500 Server Error). Đối với `fetch()`, request chỉ thất bại (reject) khi gặp lỗi kết nối vật lý (mất mạng, DNS sập, hoặc bị chặn CORS).
    *   *Cách viết code chuẩn khi phỏng vấn:* Phải kiểm tra thuộc tính `res.ok` (trả về true nếu status code trong khoảng 200 - 299) hoặc check `res.status` trước khi parse:
        ```javascript
        const fetchData = async () => {
          try {
            const res = await fetch("http://localhost:5000/api/main/sensors");
            if (!res.ok) {
              throw new Error(`Lỗi HTTP! Mã lỗi: ${res.status}`);
            }
            const data = await res.json();
            return data;
          } catch (error) {
            console.error("Lỗi mạng hoặc API thất bại:", error.message);
          }
        };
        ```

### 1.5. Cơ Chế Hoạt Động Của Event Loop (Node.js/Trình duyệt)
*   **Call Stack:** Nơi chứa các hàm đang được thực thi. Hàm nào gọi sau cùng sẽ nằm trên cùng (LIFO - Last In First Out). Khi chạy xong, hàm sẽ được rút ra khỏi stack.
*   **Web APIs / C++ Web Workers:** Nơi thực thi các tác vụ bất đồng bộ (như hẹn giờ, gọi API, truy vấn DB).
*   **Callback Queue (Task Queue):** Nơi chứa các callback đã xử lý xong ở luồng ngầm, chờ được đưa lại vào Call Stack.
*   **Phân biệt Queue:**
    *   **Microtask Queue:** Ưu tiên cực cao (Gồm: callback của `Promise`, `process.nextTick`).
    *   **Macrotask Queue:** Ưu tiên thấp hơn (Gồm: `setTimeout`, `setInterval`, sự kiện I/O, Click).
*   **Cơ chế Event Loop:**
    1.  Kiểm tra xem Call Stack có trống không.
    2.  Nếu Call Stack trống, Event Loop sẽ chạy sạch toàn bộ callback nằm trong **Microtask Queue** trước.
    3.  Sau đó, nó lấy **một** callback từ **Macrotask Queue** đẩy lên Call Stack để thực thi.
    4.  Lặp lại chu kỳ trên.

---

## 2. REACTJS CORE

### 2.1. Cấu Trúc Thành Phần & Luồng Dữ Liệu
*   **Functional Components:** Hàm JavaScript nhận vào đối số `props` và trả về mã JSX (mô tả UI hiển thị). Từ bản React 16.8, Functional Component đã thay thế hoàn toàn Class Component nhờ sự ra đời của Hooks.
*   **Props:** Dữ liệu truyền từ Component cha xuống Component con. Props là **chỉ đọc (Read-only / Immutable)**, component con nhận được không được phép tự ý thay đổi trực tiếp props.
*   **State:** Trạng thái nội bộ của Component, có thể thay đổi được (Mutable). Khi state thay đổi, React sẽ tự động kích hoạt quá trình re-render component để cập nhật UI tương ứng.
*   **Luồng dữ liệu một chiều (Unidirectional Data Flow):** Dữ liệu chỉ chảy từ trên xuống (từ Cha xuống Con thông qua props). Để gửi dữ liệu ngược từ con lên cha, ta phải truyền một hàm callback từ cha xuống con làm props, rồi con gọi hàm đó và truyền dữ liệu qua đối số.

### 2.2. Chi Tiết Về Các React Hooks
*   **`useState`:** Khai báo một biến trạng thái trong component.
    *   *Cú pháp:* `const [state, setState] = useState(initialValue);`
    *   *Lưu ý:* Hàm `setState` là bất đồng bộ. Nếu thay đổi state liên tiếp, React sẽ gom chúng lại (batching) để render một lần nhằm tối ưu hiệu năng.
*   **`useEffect`:** Xử lý các tác vụ ngoài luồng (Side Effects) như: fetch dữ liệu từ API, kết nối socket, tương tác trực tiếp DOM, thiết lập Timer.
    *   *Cấu trúc Dependency Array:*
        *   `useEffect(fn)` (Không truyền mảng): Chạy lại sau **mọi lần** component render. (Nên tránh vì dễ gây treo ứng dụng).
        *   `useEffect(fn, [])` (Mảng rỗng): Chỉ chạy **duy nhất một lần** sau khi component mount (lên màn hình). Cực kỳ thích hợp để fetch dữ liệu ban đầu.
        *   `useEffect(fn, [dep1, dep2])` (Có biến phụ thuộc): Chỉ chạy lại khi một trong các biến trong mảng thay đổi giá trị.
    *   *Hàm Cleanup (Hủy bỏ tác vụ):* Hàm được return từ bên trong `useEffect`. Nó chạy trước khi component bị unmount hoặc trước khi chạy lại hiệu ứng mới. Dùng để hủy đăng ký Socket Listener, xóa bộ hẹn giờ `clearTimeout` để tránh **Memory Leak**.

### 2.3. Điều Kiện Để Một Component Re-Render
Một component trong React sẽ render lại khi một trong các điều kiện sau xảy ra:
1.  **State của nó thay đổi** (thông qua hàm cập nhật state, ví dụ: `setDevices`).
2.  **Props truyền vào từ cha thay đổi**.
3.  **Component cha của nó re-render** (khiến toàn bộ cây con cũng bị render lại, trừ khi dùng các biện pháp tối ưu như `React.memo`).

### 2.4. DOM (Document Object Model) & Virtual DOM
*   **DOM (Document Object Model) là gì?**
    *   *Định nghĩa:* DOM là một giao diện lập trình (API) đại diện cho tài liệu HTML dưới dạng một cấu trúc cây các đối tượng (DOM Tree), trong đó mỗi phần tử HTML, thuộc tính, hoặc đoạn văn bản đều là một Node (nút).
    *   *Cách trình duyệt render DOM:* 
        1. Nhận file HTML -> Parse thành DOM Tree.
        2. Nhận file CSS -> Parse thành CSSOM Tree.
        3. Kết hợp DOM + CSSOM thành **Render Tree**.
        4. Thực hiện các bước **Layout / Reflow** (tính toán kích thước, vị trí phần tử) và **Paint** (vẽ màu sắc, hình ảnh lên màn hình).
    *   *Thao tác DOM bằng JS thuần (Vanilla JS):*
        ```javascript
        const btn = document.getElementById("toggle-btn");
        btn.addEventListener("click", () => {
          btn.style.backgroundColor = "blue";
          btn.innerText = "Clicked!";
        });
        ```
*   **Tại sao thao tác trực tiếp trên DOM thật lại CHẬM?**
    *   Mỗi khi dùng JS thuần để sửa đổi cấu trúc DOM (như chèn thẻ mới, thay đổi vị trí), trình duyệt buộc phải tính toán lại kích thước và vị trí của các phần tử xung quanh (**Reflow**) và vẽ lại giao diện (**Paint**). Đây là những tác vụ ngốn CPU và phần cứng nhất trong trình duyệt. Nếu thao tác liên tục (ví dụ: cập nhật đồ thị cảm biến mỗi khi nhận MQTT), trang web sẽ bị giật, lag.
*   **Cơ chế Virtual DOM trong React giải quyết vấn đề này thế nào?**
    *   *Virtual DOM (Vdom):* Là một bản sao nhẹ (lightweight) của Real DOM được React lưu trữ trong bộ nhớ dưới dạng các Javascript Object thông thường.
    *   *Quy trình 3 bước cập nhật:*
        1.  **Tạo cây ảo mới:** Khi state thay đổi, React sẽ tạo một cây Virtual DOM mới để đại diện cho giao diện tiếp theo.
        2.  **Đối chiếu (Diffing):** React so sánh cây Virtual DOM mới này với cây cũ bằng thuật toán đối chiếu thông minh (Reconciliation). Nó tìm ra chính xác các nút (Node) có sự thay đổi.
        3.  **Cập nhật lô (Batch Update / Patching):** React chỉ cập nhật các thay đổi nhỏ nhất đó lên Real DOM trong một lượt duy nhất (được thực hiện bởi React Fiber), giảm thiểu tối đa các pha Reflow và Paint của trình duyệt.
*   **Sử dụng DOM trực tiếp trong React (Refs) và liên hệ dự án:**
    *   Mặc dù React khuyến khích lập trình khai báo (declarative) - tức là mô tả giao diện qua JSX và để React tự cập nhật DOM, nhưng có một số tình huống buộc ta phải truy cập trực tiếp vào phần tử DOM thật (imperative), ví dụ: vẽ trên Canvas, focus vào input, cuộn trang, hoặc đo kích thước phần tử.
    *   *Liên hệ dự án thực tế (`SensorChart.tsx`):* 
        Thư viện đồ thị **Chart.js** hoạt động bằng cách vẽ đồ thị trực tiếp lên phần tử `<canvas>` của HTML5 thông qua Canvas API (đây là thao tác trực tiếp trên DOM thật). Do đó, bạn buộc phải sử dụng **`useRef`** để nắm giữ tham chiếu đến phần tử DOM thật của canvas sau khi component mount:
        ```typescript
        // 1. Tạo tham chiếu ref lưu trữ DOM node
        const chartRef = useRef<HTMLCanvasElement | null>(null);

        // 2. Liên kết ref với phần tử canvas trong JSX
        return <canvas ref={chartRef}></canvas>;

        // 3. Trong useEffect, lấy DOM node thật để truyền cho Chart.js vẽ
        useEffect(() => {
          if (!chartRef.current) return;
          // chartRef.current chính là phần tử HTMLCanvasElement thật trên trình duyệt
          const ctx = chartRef.current.getContext("2d")!;
          chartInstance.current = new Chart(ctx, { ... });
          
          return () => chartInstance.current?.destroy(); // dọn dẹp khi unmount
        }, []);
        ```
        *Giải thích với nhà tuyển dụng:* *"Em sử dụng `useRef` vì Canvas 2D Context của trình duyệt yêu cầu tương tác trực tiếp lên DOM thật để vẽ đồ thị động. React JSX không có cơ chế khai báo để vẽ trực tiếp trên canvas, nên đây là tình huống bắt buộc phải dùng `useRef` để kết nối giữa mô hình khai báo của React và thư viện vẽ đồ thị trực tiếp Chart.js"*.

---

## 3. NODE.JS & EXPRESS.JS

### 3.1. Thiết Kế Web Server & Định Tuyến (Routing)
*   **Express Server:** Framework tối giản chạy trên Node.js, cung cấp hệ thống routing mạnh mẽ và xử lý middleware.
*   **Cơ chế Routing:** Định nghĩa cách ứng dụng phản hồi lại các request của client gửi tới một endpoint (URI) cụ thể bằng các HTTP method tương ứng.
    *   *Ví dụ trong dự án (`main.route.js`):*
        ```javascript
        import express from "express";
        const router = express.Router();
        
        router.get("/latest-sensors", getLatestSensors); // Phương thức GET
        router.post("/fan/status", changeFan);          // Phương thức POST
        ```

### 3.2. RESTful API Tiêu Chuẩn
REST (Representational State Transfer) định nghĩa cách cấu trúc các API sạch, dễ mở rộng.
*   **Các HTTP Methods cốt lõi:**
    *   `GET`: Truy vấn/Đọc dữ liệu (Không thay đổi dữ liệu trên server).
    *   `POST`: Tạo mới tài nguyên hoặc gửi yêu cầu thực hiện hành động (như gửi trạng thái bật quạt).
    *   `PUT`: Thay thế/Ghi đè hoàn toàn một tài nguyên cũ.
    *   `PATCH`: Cập nhật một phần của tài nguyên.
    *   `DELETE`: Xóa tài nguyên.
*   **Các HTTP Status Codes thông dụng:**
    *   `2xx` (Thành công):
        *   `200 OK`: Thành công và trả về dữ liệu.
        *   `201 Created`: Tạo mới thành công (thường dùng sau POST).
    *   `4xx` (Lỗi phía Client):
        *   `400 Bad Request`: Dữ liệu gửi lên không đúng định dạng.
        *   `401 Unauthorized`: Chưa đăng nhập/xác thực tài khoản.
        *   `403 Forbidden`: Đã đăng nhập nhưng không có quyền truy cập tài nguyên.
        *   `404 Not Found`: Không tìm thấy endpoint hoặc tài nguyên yêu cầu.
    *   `5xx` (Lỗi phía Server):
        *   `500 Internal Server Error`: Lỗi phát sinh trong code backend.

### 3.3. Cơ Chế Hoạt Động Của Middleware
*   **Khái niệm:** Middleware là một chuỗi các hàm được thực thi lần lượt khi Express nhận được request trước khi trả về response cho client.
*   *Cú pháp:* `function(req, res, next) { ... next(); }`
*   Nếu hàm middleware không kết thúc vòng đời request-response (bằng cách gửi `res.send`/`res.json`), nó bắt buộc phải gọi hàm `next()` để chuyển quyền kiểm soát sang middleware tiếp theo trong danh sách. Nếu không, request sẽ bị treo (treo kết nối).
*   *Phân loại middleware:*
    1.  **Built-in (Tích hợp sẵn):** `express.json()` giúp parse body dạng JSON.
    2.  **Third-party (Bên thứ ba):** `cors()` cấu hình bảo mật chia sẻ tài nguyên origin khác nhau.
    3.  **Application-level:** Áp dụng cho toàn bộ app (`app.use(...)`).
    4.  **Router-level:** Áp dụng cho một nhóm route (`router.use(...)`).

### 3.4. Xử Lý Tham Số Gửi Lên (Query, Params, Body)
Khi xây dựng REST API, bạn cần phân biệt 3 cách lấy dữ liệu từ request gửi lên:
1.  **`req.query` (Query Parameters):** Lấy các tham số nằm sau dấu hỏi chấm `?` trên URL. Thường dùng để lọc, tìm kiếm, phân trang.
    *   *Ví dụ URL:* `/api/main/sensors?page=2&limit=10`
    *   *Backend lấy:* `const { page, limit } = req.query;`
2.  **`req.params` (Route Parameters):** Lấy các tham số động được định nghĩa trực tiếp trong đường dẫn route (khai báo bằng dấu hai chấm `:`). Thường dùng để chỉ định ID tài nguyên cụ thể.
    *   *Ví dụ Route:* `/api/main/device/:deviceName` (URL thực tế: `/api/main/device/fan`)
    *   *Backend lấy:* `const { deviceName } = req.params; // values: "fan"`
3.  **`req.body` (Request Body):** Lấy dữ liệu ẩn được gửi kèm trong phần thân của request (thường là POST/PUT). Thường dùng để gửi dữ liệu lớn, nhạy cảm hoặc cấu trúc phức tạp.
    *   *Backend lấy:* `const { state } = req.body;` (Yêu cầu phải có `app.use(express.json())` ở phía trên).

---

## 4. DATABASE (MONGODB & MONGOOSE)

### 4.1. Khái Niệm Cơ Bản Về NoSQL (MongoDB)
*   **Không ràng buộc khắt khe (Schema-less):** Khác với SQL có các bảng (Tables) chứa các cột tĩnh cố định, MongoDB lưu trữ dữ liệu dưới dạng các tài liệu (Documents) tương tự định dạng JSON (BSON). Mỗi Document trong cùng một bộ sưu tập (Collection) có thể có các trường dữ liệu khác nhau.
*   **Khả năng mở rộng (Scaling):** Dễ dàng mở rộng hệ thống theo chiều ngang (Horizontal Scaling) bằng cách phân tán dữ liệu ra nhiều máy chủ khác nhau (Sharding), tối ưu tốt cho hệ thống ghi dữ liệu liên tục tần suất lớn (ghi log sensor).

### 4.2. Các Câu Lệnh CRUD Với Mongoose
*   **Create (Tạo mới):**
    ```javascript
    const newRecord = await Sensor.create({ temperature: 28, humidity: 60, light: 100 });
    ```
*   **Read (Đọc/Tìm kiếm):**
    ```javascript
    // Tìm kiếm nhiều bản ghi kèm theo sắp xếp và giới hạn số lượng
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    ```
*   **Update (Cập nhật):**
    ```javascript
    // Cập nhật hoặc chèn mới nếu chưa có (upsert: true)
    await DeviceState.updateOne(
      { device: "fan" },
      { state: "on", updatedAt: new Date() },
      { upsert: true }
    );
    ```
*   **Delete (Xóa):**
    ```javascript
    await Sensor.deleteMany({ _id: { $in: deleteIds } });
    ```

### 4.3. Phân Trang Phía Server (Server-side Pagination)
*   **Bản chất thuật toán:** Sử dụng tổ hợp hai hàm `.skip()` và `.limit()`.
*   **Công thức:**
    *   `limit`: Số bản ghi muốn lấy ra trên một trang.
    *   `skip` (số bản ghi cần bỏ qua) = `(page - 1) * limit`.
*   *Ví dụ code hoàn chỉnh:*
    ```javascript
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Thực thi song song lấy dữ liệu và đếm tổng số bản ghi bằng Promise.all để tăng tốc độ
    const [results, totalResults] = await Promise.all([
      Sensor.find().skip(skip).limit(limit),
      Sensor.countDocuments()
    ]);
    
    const totalPages = Math.ceil(totalResults / limit);
    res.json({ results, totalPages, totalResults });
    ```

---

## 5. GIT & CÔNG CỤ DEBUG

### 5.1. Git Workflow Cơ Bản
*   **`git status`:** Kiểm tra các file nào đã bị chỉnh sửa, file nào chưa được track.
*   **`git add .`:** Đưa toàn bộ các file đã thay đổi vào khu vực Staging (chuẩn bị commit).
*   **`git commit -m "message"`:** Lưu lại ảnh chụp trạng thái code hiện tại vào local repository với mô tả ngắn gọn.
*   **`git pull origin master`:** Kéo code mới nhất từ kho lưu trữ chung (Remote Github/Gitlab) về máy cục bộ và tự động gộp (merge).
*   **`git push origin master`:** Đẩy các commit từ máy cục bộ lên remote repository.
*   **Làm việc với nhánh (Branch):**
    *   `git checkout -b feature/auth`: Tạo nhánh mới tên là `feature/auth` và chuyển sang nhánh đó để code tính năng mới độc lập.
    *   `git checkout master`: Chuyển về nhánh chính.
    *   `git merge feature/auth`: Gộp các thay đổi từ nhánh `feature/auth` vào nhánh hiện tại.
*   **Xử lý Conflict (Xung đột code):** Xảy ra khi hai lập trình viên cùng chỉnh sửa một dòng trong cùng một file trên cùng một nhánh và đẩy lên Git.
    *   *Cách xử lý:* Git sẽ chèn các dấu đánh dấu (`<<<<<<< HEAD`, `=======`, `>>>>>>>`). Ta phải mở file đó ra, thảo luận với đồng nghiệp để chọn giữ lại code của ai hoặc kết hợp cả hai, xóa các dấu đánh dấu đi, rồi thực hiện `git add`, `git commit` để hoàn thành merge.

### 5.2. Công Cụ Debugging Thực Tế (Chrome DevTools)
Khi phỏng vấn, nếu được hỏi: *"Khi ứng dụng React không lấy được dữ liệu từ API, em sẽ làm gì để tìm nguyên nhân?"*, hãy trả lời theo quy trình sau:
1.  **Nhấn F12 mở Chrome DevTools:**
2.  **Kiểm tra tab Console:** Xem có lỗi Javascript nào bị đỏ không (ví dụ: lỗi syntax, hoặc lỗi gọi biến undefined).
3.  **Kiểm tra tab Network:**
    *   Xem request API có được gửi đi không?
    *   Status trả về là bao nhiêu?
        *   Nếu status `404`: Sai đường dẫn API.
        *   Nếu status `500`: Lỗi ở code Server Node.js -> Lúc này phải mở log terminal backend để xem chi tiết lỗi.
        *   Nếu status `CORS error`: Server chưa cho phép domain của frontend gọi tới.
        *   Kiểm tra tab *Payload* xem dữ liệu truyền lên đúng yêu cầu không và tab *Preview/Response* xem Server trả về dữ liệu cấu trúc thế nào.
4.  **Kiểm tra tab Application:** Kiểm tra xem trạng thái của Cookie, LocalStorage, SessionStorage nếu tính năng có liên quan đến đăng nhập hay lưu session người dùng.
