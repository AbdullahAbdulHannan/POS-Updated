import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const InvoiceModal = ({ isOpen, onClose, selectedBill }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  if (!isOpen || !selectedBill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Invoice Details
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={componentRef} className="p-6 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Techinfo YT POS
            </h1>
            <p className="text-gray-600">
              Contact: 123456 | Karachi Pakistan
            </p>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer Name:</p>
                <p className="font-semibold">{selectedBill.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone No:</p>
                <p className="font-semibold">{selectedBill.customerNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-semibold">{selectedBill.date.toString().substring(0, 10)}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-semibold capitalize">{selectedBill.paymentMode}</p>
              </div>
            </div>
            <hr className="mt-4" />
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 text-left font-semibold text-gray-900">Item</th>
                  <th className="py-3 text-left font-semibold text-gray-900">Qty</th>
                  <th className="py-3 text-left font-semibold text-gray-900">Price</th>
                  <th className="py-3 text-left font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.cartItems?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.name}</td>
                    <td className="py-3 text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-gray-700">${item.price}</td>
                    <td className="py-3 text-gray-900">${(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}

                <tr className="border-b border-gray-200">
                  <td colSpan="3" className="py-3 text-right font-semibold text-gray-900">
                    Subtotal:
                  </td>
                  <td className="py-3 font-semibold text-gray-900">
                    ${selectedBill.subTotal?.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td colSpan="3" className="py-3 text-right font-semibold text-gray-900">
                    Tax:
                  </td>
                  <td className="py-3 font-semibold text-gray-900">
                    ${selectedBill.tax?.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td colSpan="3" className="py-3 text-right font-bold text-gray-900 text-lg">
                    Grand Total:
                  </td>
                  <td className="py-3 font-bold text-gray-900 text-lg">
                    ${selectedBill.totalAmount?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center text-sm text-gray-600 border-t pt-6">
            <p className="font-medium mb-2">
              <strong>Thank you for your order!</strong> 10% GST application on total amount.
              Please note that this is non refundable amount. For any assistance please write email
              <strong> help@mydomain.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;